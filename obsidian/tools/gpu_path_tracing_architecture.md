# GPU 路径追踪架构知识梳理

> 基于 WebGPU 平台的离线/实时渲染器设计实践

---

## 一、核心概念速查

### 1.1 坐标系

| 坐标系 | 参照物 | 相机移动时 | 适用场景 |
|--------|--------|-----------|---------|
| **世界空间 (World-space)** | 场景原点 | 法线值**不变** | 静态场景、多视角渲染、时序稳定性要求高 |
| **视图/相机空间 (View-space)** | 相机/观察者 | 法线值**改变** | 单帧渲染、相机固定 |

> **OIDN 法线输入**：支持 world-space 或 view-space，分量范围 `[-1, 1]`，不需要归一化。citeOIDN doc/api.md

---

## 二、调度策略三维模型

路径追踪的调度是三个**正交维度**的组合：

```
维度 1: 屏幕空间分割
  ├── Full-frame（全屏一次 dispatch）
  └── Tile-based（瓦片分块 dispatch）

维度 2: 采样聚合（每个像素内）
  ├── 1 sample / 线程
  └── N samples / 线程（内部循环）

维度 3: 路径深度处理（每个 sample 内）
  ├── Loop-bounce（单 dispatch 内循环所有 bounce）
  └── Wavefront（每 bounce 一次 dispatch）
```

### 2.1 各策略适用场景

| 策略 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **Full-frame + Loop-bounce** | 代码简单、dispatch 开销低 | 路径 divergence 严重、寄存器压力大 | 简单场景、实时 RT、教学 demo |
| **Tile-based + Loop-bounce** | 控制单次执行时间、渐进预览 | 总 dispatch 次数多 | WebGPU、核显、大分辨率 |
| **Wavefront (Bounce-split)** | 通过 stream compaction 消除 divergence | 多次 dispatch 开销、需要全局同步 | CUDA/OptiX、复杂离线场景 |
| **Full-frame Progressive** | 全图一起收敛、无 tile 边界 | 显存要求高、无法局部预览 | Cycles X、显存充足 |

---

## 三、Tile 策略详解

### 3.1 工业界默认值

| 渲染器 | 默认/推荐 Tile 大小 | 备注 |
|--------|---------------------|------|
| Blender Cycles (2.83) | 128×128（GPU 推荐 256×256） | 早期 GPU 版本 |
| Blender Cycles X (3.0+) | 2048×2048（但默认关闭 tile） | 全屏 progressive 为默认 |
| V-Ray GPU | 256×64 / 192×32 | 矩形 tile 优化 |
| Arnold (Bucket) | 64×64 | 保守默认值 |
| **通用经验** | GPU: 256×256 / CPU: 32×32 | 2 的幂次方为优 |

### 3.2 Tile 的真正目的

> ❌ **错误理解**：GPU dispatch 维度限制导致分 tile
> 
> ✅ **正确理解**：
> - **显存管理**：大场景 BVH/纹理无法一次全载入，按 tile 流式加载
> - **渐进预览**：用户可提前看到部分区域结果
> - **多 GPU 负载均衡**：静态分配 tiles 给不同 GPU
> - **TDR 防护**：控制单次 shader 执行时间，避免系统超时重置
> - **内存带宽优化**：tile 提升 L2 cache 局部性

### 3.3 Super Tiles

将多个小 tile 打包成一批，一次性提交给 GPU：

```
传统做法：6 个 tile → 6 次 dispatch
Super Tile：6 个 tile 打包 → 1 次 dispatch（每个 workgroup/线程处理一个 tile）
```

目的：减少 CPU 提交开销，提升 GPU occupancy。

---

## 四、Wavefront 路径追踪

### 4.1 标准流程

```
Dispatch 1: 所有像素的 Primary Ray (Bounce 0) → 求交 → 记录命中点
Dispatch 2: 所有像素的 Bounce 1 → 求交 → 着色 → 生成下一次光线
Dispatch 3: 所有像素的 Bounce 2 → 求交 → 着色 → 生成下一次光线
...
Dispatch N: 剩余存活路径 → 求交 → 着色 → 路径终止
```

### 4.2 Stream Compaction

每次 dispatch 后，通过 compaction 剔除已终止的路径，后续 dispatch 只处理存活路径。

**为什么需要它？**
- 一个 warp 中线程 A 3 次 bounce 结束，线程 B 12 次 bounce 还在递归
- 线程 A 空转等待线程 B → 性能暴跌
- Compaction 把存活路径重新打包，保证每轮 dispatch 的线程都是"有效工作"

### 4.3 深层 Bounce 优化（UE 策略）

```
Bounce 0-5: 单独 dispatch（路径数多，值得单独调度）
Bounce 6+: 合并为一个循环内核（路径数少，dispatch 开销占主导）
```

> 参考：Unreal Engine 5 Path Tracer 文档，默认 6 次后合并，设为 -1 才严格每 bounce dispatch。

---

## 五、Occupancy 与性能

### 5.1 什么是 Occupancy？

GPU 的**占用率**：每个 SM（流式多处理器）上同时驻留的 warp/thread 数量占最大容量的比例。

**为什么重要？**
- GPU 通过**多线程并发**隐藏内存延迟
- Occupancy 低 → 同时活跃的线程少 → 延迟无法隐藏 → 性能差

### 5.2 影响 Occupancy 的因素

| 因素 | 影响 |
|------|------|
| **寄存器用量** | 每个线程用的寄存器越多，SM 能同时驻留的线程越少 |
| **共享内存** | 每个 block 用的 shared memory 越多，同时驻留的 block 越少 |
| **Workgroup 大小** | 太小（如 4×4=16）无法填满 warp；太大（如 32×32=1024）可能超过硬件限制 |
| **路径 Divergence** | 一个 warp 内线程执行路径不同 → 有效 occupancy 下降 |

### 5.3 WebGPU 的 Sweet Spot

- **Workgroup size**: 64 threads（8×8）是通用最优
- **Tile size**: 64×64（低端）到 256×256（高端）
- **Dispatch 规模**: 至少几百个 workgroup 才能填满 GPU

---

## 六、Accumulation（渐进累加）

### 6.1 核心机制

路径追踪是蒙特卡洛方法，需要大量随机采样后取平均：

```
第 1 帧: pixel = (0.5, 0.2, 0.1)  →  很噪
第 2 帧: pixel = (0.6, 0.3, 0.2)  →  很噪
第 3 帧: pixel = (0.4, 0.1, 0.1)  →  很噪
...

累加: accum = (1.5, 0.6, 0.4)
平均: final = (0.5, 0.2, 0.133)  →  逐渐收敛
```

### 6.2 双缓冲结构

```wgsl
@group(0) @binding(0) var<storage, read_write> accumulationBuffer: array<vec3f>;
@group(0) @binding(1) var<uniform> sampleCount: u32;

// 每帧累加
accumulationBuffer[idx] += currentSample;

// 显示时归一化
displayColor = accumulationBuffer[idx] / f32(sampleCount);
```

### 6.3 Progressive Rendering 的优势

- **随时预览**：第 1 个 sample 就能显示
- **随时停止**：够清晰就停
- **自适应采样**：噪声大的区域加更多 sample
- **交互式调整**：改相机/材质后清空 buffer 重新累加

---

## 七、WebGPU 特殊约束

### 7.1 为什么 WebGPU 不适合 Wavefront？

| 约束 | 影响 |
|------|------|
| **高 dispatch 开销** | JS → Command Encoder → GPU Process → 驱动，单次 0.1-1ms |
| **无全局同步** | 没有 `__threadfence()`，stream compaction 只能靠慢速 global atomic |
| **TDR 限制** | 核显/移动 GPU 单段 shader 超时 2-5 秒，直接崩溃 |
| **无 CUDA 特性** | 无 cooperative groups、无 device-wide sync |

### 7.2 WebGPU 的标准做法

> **Tile Progressive with Fixed Architecture**

```
每轮 dispatch 处理一个 tile
每个线程负责一个像素
内部循环完成该像素的 1 次完整采样（所有 bounce）
结果累加到全局 accumulation buffer
通过 requestAnimationFrame 控制帧时间
```

### 7.3 硬件分级配置（启动时检测）

```javascript
const CONFIGS = {
    low: {    // 低端核显 / 移动
        tileSize: 64,
        tilesPerBatch: 1,      // 每轮 1 个 tile
        workgroupSize: [8, 8],
        maxBounces: 3,
        targetFrameTime: 33    // 30fps
    },
    mid: {    // 中端集成
        tileSize: 128,
        tilesPerBatch: 4,
        workgroupSize: [8, 8],
        maxBounces: 4,
        targetFrameTime: 16     // 60fps
    },
    high: {   // 高端独显
        tileSize: 256,
        tilesPerBatch: 16,     // 一次 16 个 tile
        workgroupSize: [8, 8],
        maxBounces: 8,
        targetFrameTime: 16
    }
};
```

### 7.4 动态调整（仅调整 batch size，不切换架构）

```javascript
let tilesPerBatch = config.tilesPerBatch;

function adaptiveRender() {
    const start = performance.now();
    renderBatch(tilesPerBatch);
    const elapsed = performance.now() - start;

    if (elapsed > targetFrameTime * 1.2) {
        tilesPerBatch = Math.max(1, tilesPerBatch - 1);
    } else if (elapsed < targetFrameTime * 0.5) {
        tilesPerBatch++;
    }

    requestAnimationFrame(adaptiveRender);
}
```

---

## 八、常见误区纠正

| 误区 | 纠正 |
|------|------|
| "Tile 是因为 GPU dispatch 维度放不下全屏" | ❌ GPU dispatch 上限 65535，4K 完全没问题。Tile 是为了显存管理、TDR 防护、渐进预览 |
| "Occupancy 低就内部循环多 sample" | ❌ Occupancy 低说明寄存器压力大，再套循环会更糟。应该拆 dispatch 或优化 shader |
| "运行时动态切换 Wavefront / Tile / 单 dispatch" | ❌ 工业界不做。架构切换成本太高，数据流完全不同。启动时选一套，固定执行 |
| "Wavefront 累加不同 dispatch 的结果完成一次采样" | ❌ Wavefront 是同一次采样的不同 bounce 阶段，是**顺序执行**不是累加。Progressive 才是不同采样之间的累加 |
| "Super Tile 是 tile 的 tile" | ✅ 正确。多个小 tile 打包成一批 dispatch，减少 CPU 提交开销 |

---

## 九、决策速查表

```
场景评估
  │
  ├── 简单场景（无递归/浅反射/小场景）
  │     └── Full-frame + Loop-bounce
  │
  └── 复杂场景
        │
        ├── 显存不足？
        │     └── 必须 Tile（与 bounce 策略无关）
        │
        ├── WebGPU / 核显 / 浏览器环境？
        │     └── Tile + Loop-bounce + Progressive Accumulation
        │
        ├── CUDA / OptiX / 高端独显？
        │     └── Wavefront（每 bounce dispatch）
        │           └── 深层 bounce 合并为循环（UE 策略）
        │
        └── 路径长度一致（无 divergence）？
              └── 单 dispatch 内循环即可
```

---

## 十、参考来源

- OIDN 官方文档：`doc/api.md`（法线输入坐标系说明）
- Blender Cycles X 官方文档（Tile vs Progressive 策略）
- Unreal Engine 5 Path Tracer 文档（Bounce 合并策略）
- WebGPU 规范：`maxComputeWorkGroupCount`、Workgroup 限制
- Three.js `webgpu-path-tracer` 开源实现
- `daikiad/webgpu-path-tracer` 开源实现
- 智谱 GLM-5.2 / Kimi K2.7 Code 官方 API 文档（2026.06）

---

> 文档整理时间：2026-07-01
> 适用平台：WebGPU / 浏览器 / 跨硬件 GPU 渲染
