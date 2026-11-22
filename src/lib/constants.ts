import type { Project } from '@/types'

const featuredProject: Project = {
  slug: 'prism',
  name: 'Prism',
  description:
    '一个不依赖 three.js 的 WebGPU 路径追踪器：自研两级 BVH、NEE + MIS、渐进累积，把 glTF / PBR / 位移材质装进浏览器。',
  url: 'https://github.com/bijingdabaihua/Prism',
  demo: 'https://bijingdabaihua.github.io/Prism/',
  cover: '/images/prism.jpg',
  tech: ['TypeScript', 'WebGPU', 'WGSL', 'Path Tracing', 'BVH'],
  highlights: [
    '两级 BVH（TLAS / BLAS），分桶 SAH 构建，扁平 Float32Array 节点表；shader 里用 64 层遍历栈。',
    'NEE + MIS：直接光采样与环境图重要性采样结合，降低直接光和环境光的采样方差。',
    '渐进累积：按随机排列逐像素采样，每帧按 GPU 实测耗时自适应预算，拖动相机时也始终有画面。',
    'PBR 材质 / glTF 2.0 / 四套 texture_2d_array 图集；位移贴图在 CPU 上烘成真实几何，shader 不需要知道位移存在。',
    '渲染在 Worker 里用 OffscreenCanvas 完成，主线程只处理 UI 和相机输入。',
  ],
}

const otherProjects: Project[] = [
  {
    slug: 'wordlens',
    name: 'WordLens',
    description:
      '阅读英文网页时划词翻译的 Chrome 扩展。本地 5000+ 词库毫秒级命中，未命中交给 DeepSeek，并带复习队列和 GitHub 同步。',
    url: 'https://github.com/bijingdabaihua/wordlens',
    tech: ['TypeScript', 'Chrome MV3', 'Vite', 'DeepSeek'],
    highlights: [
      '本地词库优先，未命中再调用 AI，并把结果写回本地词库，查得越多命中越快。',
      '复习队列按遗忘率和查词频率排序，把「查词」和「记住」连成闭环。',
      '词库通过 GitHub 仓库跨设备同步；句子翻译支持流式逐字输出。',
    ],
  },
  {
    slug: 'dictate',
    name: 'Dictate',
    description:
      'macOS 上的本地听写工具：按住左 Option 说话，松开后把文字粘贴到光标处，录音和识别都不离开电脑。',
    url: 'https://github.com/bijingdabaihua/voice-dictate',
    tech: ['Python', 'Qwen3-ASR', 'MLX', 'macOS'],
    highlights: [
      '基于 Qwen3-ASR + MLX，在 Apple Silicon 上本地完成语音识别，录音不上传。',
      '全局热键 + 流式字幕，松开自动粘贴，并恢复原来的剪贴板内容。',
      '支持中英混说和自定义热词；菜单栏 App，无账号、无订阅。',
    ],
  },
  {
    slug: 'wgsl-formatter',
    name: 'WGSL Formatter',
    description:
      '给 WebGPU 着色器用的 VS Code 格式化扩展：缩进、空格、结构体字段对齐，支持保存时自动格式化。',
    url: 'https://github.com/bijingdabaihua/wgsl-formatter',
    tech: ['TypeScript', 'VS Code API', 'WGSL'],
    highlights: [
      '解析 WGSL 语法并做容错格式化，语法有错误时也尽量保留可读结构。',
      '结构体字段自动对齐，缩进、空格和换行风格可以配置。',
      '支持保存时格式化，已发布到 VS Code Marketplace。',
    ],
  },
]

const projects = [featuredProject, ...otherProjects]

export { featuredProject, otherProjects }

export const siteConfig = {
  title: 'bijingdabaihua',
  name: 'bijingdabaihua',
  handle: 'bijingdabaihua',
  role: 'Software Engineer · Graphics & Web',
  description:
    'bijingdabaihua — 软件工程师，关注图形渲染、前端工程与开发者工具。用 WebGPU 从零写路径追踪器，也做浏览器扩展和开发工具。',
  url: 'https://bijingdabaihua.github.io',
  email: 'bijingdabaihua@gmail.com',
  github: 'bijingdabaihua',
  avatar: '/images/avatar.jpg',
  projects,
}
