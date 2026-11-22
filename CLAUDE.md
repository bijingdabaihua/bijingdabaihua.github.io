# CLAUDE.md - 个人站项目约定

## 定位

这是 bijingdabaihua 的个人作品集 + 技术博客，用于求职和展示项目。主角是 Prism（WebGPU 路径追踪器），其次是浏览器扩展、本地 AI 工具和开发工具。页面以中文为主，技术名词保留英文。

线上地址：<https://bijingdabaihua.github.io/>
Prism Demo：<https://bijingdabaihua.github.io/Prism/>

## 基本约定

- 昵称：`bijingdabaihua`，全英文，不得出现中文或拼音变体。
- 头像：`/images/avatar.jpg`，用 `siteConfig.avatar` 引用。
- 联系方式以 `src/lib/constants.ts` 的 `siteConfig` 为准；不要在未确认的情况下改邮箱或加其他联系方式。
- 不添加访问统计、Cookie、第三方字体或外部 UI 库。

## 技术栈

- Next.js 16（App Router）+ React 19 + TypeScript
- Tailwind CSS v4
- Markdown：`content/posts/` + gray-matter 解析 frontmatter
- 渲染：react-markdown + remark-gfm + rehype-highlight
- 部署：静态导出（`output: 'export'`）到 `out/`，GitHub Actions 发布到 GitHub Pages

## 设计

- 深色编辑风：页面 `#0a0a0b`，正文 `#ededed`，次要文字 `#9a9aa1`，暖色强调 `#e6b98a`。
- 颜色、字体都定义在 `src/app/globals.css` 的 `@theme inline` 里，用 `bg-page`、`text-text-secondary`、`border-border-light` 这类 token，不写死新的十六进制颜色。
- 最大内容宽度 1120px；阅读页 760px；移动端左右 24px。
- 标题紧凑（负字距），元信息用等宽字体、大写、宽字距。
- 动效克制：只保留首屏 `animate-rise` 和 hover 过渡；必须尊重 `prefers-reduced-motion`。
- 不引入大面积渐变、玻璃拟态卡片或装饰性插画。项目截图是主要的视觉元素。

## 路由与数据

- `/`：Hero、精选项目（Prism）、其他项目、About、Writing、Contact。
- `/projects/[slug]/`：项目详情，`demo` 存在时给主按钮和 Try it 区块。
- `/writing/`：文章列表；`/writing/[slug]/`：文章详情。
- 项目数据集中在 `src/lib/constants.ts`；文章由 `src/lib/posts.ts` 从 `content/posts/` 读取。
- 动态路由必须提供 `generateStaticParams`，并保持 `dynamicParams = false`，否则静态导出会多出空路径。

## 内容约定

文章文件名即 slug，推荐 `kebab-case.md`；frontmatter：

```yaml
---
title: 文章标题
date: "2026-11-22"   # 必须加引号，避免 YAML 解析成 Date
summary: 一句话摘要
tags: [WebGPU, 图形学]
---
```

- 文章要解释「为什么」和取舍，不写只复述 API 的教程。
- 技术细节必须和 Prism 仓库的实际实现一致；不确定的先去看代码。
- 项目描述要具体：写清楚做了什么、怎么做的，不用「高性能」「现代化」这类空词。
- 新增项目：在 `src/lib/constants.ts` 加 `Project`，封面放 `public/images/`，详情页自动生成。

## 部署

- 推送到 `main` 触发 `.github/workflows/deploy.yml`：`npm ci` → `npm run build` → 上传 `out/` → `actions/deploy-pages`。
- 这是用户主页仓库，站点在 `/`；Prism 是独立项目页，在 `/Prism/`，两者不要混用 base 路径。
- 本地不要用 `next start` 预览导出结果；用 `npx serve out`。

## 命令

```bash
npm run dev      # 开发服务器（3000）
npm run build    # 静态导出到 out/
npm run lint     # ESLint
```

## 隐私

- `src/lib/resume-data.plain.ts` 含未加密个人信息，已被 `.gitignore` 忽略，永远不要提交。
- `obsidian/` 下可能有个人笔记；不要批量 `git add`，只提交明确要发布的内容。
- 提交前检查 `git status`，不要把个人笔记、临时文件、截图带进仓库。
