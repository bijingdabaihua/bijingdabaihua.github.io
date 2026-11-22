# CLAUDE.md - 个人站项目约定

## 定位

这是 bijingdabaihua 的个人主页与技术博客，不是求职作品集。先像一个“人”的站点：自我介绍、项目、文章、想法。求职是附带结果，不要把它做成首页的主叙事。

线上地址：<https://bijingdabaihua.github.io/>
Prism Demo：<https://bijingdabaihua.github.io/Prism/>

## 基本约定

- 昵称：`bijingdabaihua`，全英文，不得出现中文或拼音变体。
- 联系方式以 `src/lib/constants.ts` 的 `siteConfig` 为准；不要在未确认的情况下改邮箱或加其他联系方式。
- 不添加访问统计、Cookie、第三方字体、外部 UI 库或评论系统。

## 技术栈

- Next.js 16（App Router）+ React 19 + TypeScript
- Tailwind CSS v4
- Markdown：`content/posts/` + gray-matter
- 渲染：react-markdown + remark-gfm + rehype-highlight
- 部署：静态导出（`output: 'export'`）到 `out/`，GitHub Actions 发布到 GitHub Pages

## 审美与布局

当前方向是**纸页/笔记本**，不是产品落地页：

- 背景 `#f7f4ed`，正文 `#24211c`，次要文字 `#5f5a51`，强调色 `#8f5a3c`。
- 标题用衬线字体（`font-serif`，Songti SC / Noto Serif SC 栈），正文用系统无衬线；日期和少量元信息用等宽。
- 内容栏 720px，文章阅读栏 680px；左右留白要大，页面要安静。
- 首页顺序：自我介绍 → 写的 → 做的 → 关于。写作放在项目前面。
- 分区标题就用中文的“写的 / 做的 / 关于”，不要加全大写英文小标题、编号或装饰线。
- 首页最多放一张图（Prism 的小缩略图）；其余项目用文字列表，不用卡片网格。
- 链接克制：正文内用下划线，导航/操作链接默认无下划线，hover 变强调色。
- 动效只保留 hover 过渡；尊重 `prefers-reduced-motion`。

**不要使用**：

- “Open to opportunities”、状态点、求职 CTA、“有合适的机会聊聊”这类话术。
- “Selected Work / Featured / Technical Notes / Try it / 04 projects”这类模板标签。
- 技术标签胶囊、项目编号、大圆角卡片、大号填充按钮、悬浮玻璃导航。
- 简历式技能表（Languages / Skills 网格）。兴趣和技术栈放进自然段。
- 首页大图轮播或全屏 Hero 图。

如果以后要放简历，做成一个安静的链接或独立页面，不要改变首页的气质。

## 路由与数据

- `/`：自我介绍、最近文章、项目列表、关于与联系方式。
- `/projects/[slug]/`：项目详情，正文 + 实现细节 + Demo/源码/技术笔记。
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
- 项目描述要具体，写清楚做了什么、怎么做的，不用「高性能」「现代化」这类空词。
- 新增项目：在 `src/lib/constants.ts` 加 `Project`（`description`、`body`、`tech`），封面放 `public/images/`，详情页自动生成。
- 技术文章链接通过 `Project.post` 关联。

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
