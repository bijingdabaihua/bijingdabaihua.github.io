# CLAUDE.md - 博客项目约定

## 基本约定

- 昵称：bijingdabaihua（必须全英文，不得使用中文或拼音变体）
- 头像：`/images/avatar.jpg`，网站中用 `site.avatar` 引用
- 邮箱：2397809455@qq.com

## 命名约定

- 昵称统一使用 bijingdabaihua，不得出现"大白花"或其他中文变体

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **样式**: Tailwind CSS v4
- **部署**: GitHub Pages（静态导出 `output: "export"`）
- **CI/CD**: GitHub Actions（`.github/workflows/deploy.yml`）
- **内容**: Markdown 文件（`content/posts/`），gray-matter 解析 frontmatter

## 样式约定

- 主题色：`#5b7fff`（柔和的蓝色）
- 背景色：`#f8f9fa`
- 正文字体：系统字体 + PingFang SC 等中文字体优先
- 正文行高：`1.8`
- 博客文章在首页以白色卡片展示
- 顶部导航栏粘性定位，含毛玻璃效果
- 代码块使用暗色主题（`#1e1e2e` 背景）
- 文章内容区域为白色卡片，圆角 `12px`

## 文件结构

- `content/posts/` - 博客文章（Markdown 格式，文件名: `YYYY-MM-DD-title.md`）
- `src/app/` - Next.js App Router 页面
- `src/components/` - React 组件
- `src/lib/` - 工具函数（posts.ts, constants.ts）
- `public/images/` - 静态资源（头像等）

## 部署

- 本项目为纯静态站点（无动态功能）
- push 到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages
- 访问地址：`https://bijingdabaihua.github.io`
