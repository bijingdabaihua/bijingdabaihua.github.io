# bijingdabaihua.github.io

个人主页与技术博客：项目、文章，以及一些还没想明白的问题。

- 首页：<https://bijingdabaihua.github.io/>
- Prism 在线 Demo：<https://bijingdabaihua.github.io/Prism/>
- 文章：<https://bijingdabaihua.github.io/writing/>

## 技术栈

- Next.js 16（App Router）+ React 19
- Tailwind CSS v4
- Markdown + gray-matter + react-markdown
- 静态导出（`output: 'export'`），GitHub Pages + GitHub Actions

## 开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 静态导出到 out/
npm run lint
```

本地预览构建结果：

```bash
npx serve out
```

## 写文章

在 `content/posts/` 新建 Markdown 文件，文件名会成为 slug：

```markdown
---
title: 文章标题
date: "2026-11-22"
summary: 列表页和 SEO 用的一句话摘要。
tags: [WebGPU, 图形学]
---

正文……
```

日期用引号包起来，避免 YAML 把它解析成 `Date` 对象。文章会自动出现在首页和 `/writing/`。

## 项目

项目数据在 `src/lib/constants.ts`。新增项目时补一个 `Project`：

```ts
{
  slug: 'project-slug',
  name: 'Project',
  description: '一句话说明',
  body: ['项目详情页的正文段落'],
  url: 'https://github.com/...',
  demo: 'https://...',      // 可选
  cover: '/images/...jpg',  // 可选
  tech: ['TypeScript'],
  highlights: ['实现细节'], // 可选
  post: 'article-slug',     // 可选，关联技术文章
}
```

首页只展示前三个技术词和一句话说明；详情页再展开 `body` 和 `highlights`。封面图放 `public/images/`。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建 `out/` 并通过 GitHub Pages 发布。

该仓库是用户主页仓库（`bijingdabaihua.github.io`），站点挂在根路径 `/`；Prism 是另一个项目页，挂在 `/Prism/`。

## 目录

```text
content/posts/          Markdown 文章
public/images/          项目截图
src/app/                路由：首页 / 项目详情 / 文章 / 404
src/components/         Header / Footer / Markdown 渲染
src/lib/constants.ts    站点信息与项目数据
src/lib/posts.ts        读取 content/posts 下的文章
src/types/index.ts      Project / Post 类型
```

## 注意

- 不要把 `src/lib/resume-data.plain.ts` 提交到仓库；它包含未加密的个人信息。
- 联系方式以 `src/lib/constants.ts` 的 `siteConfig` 为准；不要在未确认的情况下修改。
