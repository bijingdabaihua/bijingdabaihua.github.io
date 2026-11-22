import type { Project } from '@/types'

const projects: Project[] = [
  {
    slug: 'prism',
    name: 'Prism',
    description:
      '一个从零写的 WebGPU 路径追踪器。用 TypeScript + WGSL，自己搭 BVH、采样和渐进累积。',
    body: [
      'Prism 是我用 TypeScript + WGSL 从零写的 WebGPU 路径追踪器。它不依赖 three.js，也没有用现成的 BVH 库：场景怎么组织、光线怎么求交、采样怎么分配，都是自己定的。',
      '它用两级 BVH 组织三角面和实例，用 NEE + MIS 组合直接光和环境采样，按随机像素序列做渐进累积。材质和 glTF 在 Worker 里编译，主线程只处理 UI 和相机输入。',
      '目前还没做玻璃和透射，景深也先关着。下一步想补材质和场景，再回头处理加载性能。',
    ],
    url: 'https://github.com/bijingdabaihua/Prism',
    demo: 'https://bijingdabaihua.github.io/Prism/',
    cover: '/images/prism.jpg',
    tech: ['TypeScript', 'WebGPU', 'WGSL', 'Path Tracing'],
    highlights: [
      '两级 BVH（TLAS / BLAS），分桶 SAH，扁平的 Float32Array 节点表。',
      'NEE + MIS，环境图按亮度 CDF 做重要性采样。',
      '按随机像素序列渐进累积，每帧按 GPU 实测耗时调整预算。',
      'PBR / glTF / 四套 texture_2d_array 图集；位移贴图在 CPU 上烘成几何。',
    ],
    post: 'prism-webgpu-path-tracer',
  },
  {
    slug: 'wordlens',
    name: 'WordLens',
    description:
      '在英文网页上划词翻译的 Chrome 扩展。本地词库优先，未命中再调用 DeepSeek。',
    body: [
      'WordLens 是一个 Chrome 扩展：在英文网页上划词，浮窗显示翻译。本地 5000+ 词库先命中，未命中再调用 DeepSeek，并把结果写回词库。',
      '它带一个复习队列，按遗忘率和查词频率排序；词库可以通过 GitHub 仓库跨设备同步。',
    ],
    url: 'https://github.com/bijingdabaihua/wordlens',
    tech: ['TypeScript', 'Chrome MV3', 'Vite'],
    highlights: [
      '本地词库优先，未命中再调用 AI，并把结果写回词库。',
      '复习队列按遗忘率和查词频率排序，把查词和复习连起来。',
      '词库通过 GitHub 同步；句子翻译支持流式输出。',
    ],
  },
  {
    slug: 'dictate',
    name: 'Dictate',
    description:
      'macOS 上的本地听写工具：按住左 Option 说话，松开就把文字粘贴到光标处。',
    body: [
      'Dictate 是 macOS 上的本地听写工具。按住左 Option 说话，松开后把文字粘贴到光标处，录音和识别都不离开电脑。',
      '识别用 Qwen3-ASR + MLX 在 Apple Silicon 上完成；支持中英混说、自定义热词和流式字幕。',
    ],
    url: 'https://github.com/bijingdabaihua/voice-dictate',
    tech: ['Python', 'Qwen3-ASR', 'MLX'],
    highlights: [
      'Qwen3-ASR + MLX 本地识别，录音不上传。',
      '全局热键、流式字幕，松开自动粘贴并恢复原剪贴板。',
      '支持中英混说和自定义热词；菜单栏 App，无账号、无订阅。',
    ],
  },
  {
    slug: 'wgsl-formatter',
    name: 'WGSL Formatter',
    description: '一个 VS Code 扩展，用来格式化 WGSL 着色器。',
    body: [
      'WGSL Formatter 是一个 VS Code 扩展，用来格式化 WebGPU 着色器。它做缩进、空格和结构体字段对齐，也可以保存时自动格式化。',
      '解析器对语法错误做了容错；已经发布到 VS Code Marketplace。',
    ],
    url: 'https://github.com/bijingdabaihua/wgsl-formatter',
    tech: ['TypeScript', 'VS Code API', 'WGSL'],
    highlights: [
      'WGSL 解析与容错格式化，语法有错误时也尽量保留可读结构。',
      '结构体字段自动对齐，缩进和空格风格可以配置。',
      '支持保存时格式化，已发布到 VS Code Marketplace。',
    ],
  },
]

export const siteConfig = {
  title: 'bijingdabaihua',
  name: 'bijingdabaihua',
  handle: 'bijingdabaihua',
  description: 'bijingdabaihua 的个人站：项目、文章，以及一些还没想明白的问题。',
  url: 'https://bijingdabaihua.github.io',
  email: 'bijingdabaihua@gmail.com',
  github: 'bijingdabaihua',
  projects,
}
