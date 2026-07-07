# 博客书籍展示功能设计方案

## 一、需求分析

| 需求项 | 说明 |
|--------|------|
| 核心目标 | 在博客中展示"正在阅读"和"喜欢的书籍" |
| 使用场景 | 在公司或任何地方通过浏览器访问博客即可查看书单 |
| 导入需求 | 支持多种数据源/格式导入书籍信息 |
| 技术约束 | 纯静态站点（Next.js + GitHub Pages），无后端服务 |

## 二、架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      数据源层 (Data Sources)                  │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│ 手动 JSON   │ 豆瓣书单    │ 微信读书    │ CSV/Excel           │
│ books.json  │ 导入脚本    │ 导入脚本    │ 导入脚本            │
└──────┬──────┴──────┬──────┴──────┬──────┴──────────┬──────────┘
       │             │             │                 │
       └─────────────┴──────┬──────┴─────────────────┘
                            ▼
              ┌─────────────────────────┐
              │   统一数据层 (Unified)   │
              │      data/books.json     │
              └────────────┬────────────┘
                           ▼
              ┌─────────────────────────┐
              │   构建时生成 (Build Time) │
              │   src/lib/books.ts       │
              │   读取 → 解析 → 排序     │
              └────────────┬────────────┘
                           ▼
              ┌─────────────────────────┐
              │   展示层 (Presentation)  │
              │   /books 页面            │
              │   书籍卡片 + 筛选 + 搜索 │
              └─────────────────────────┘
```

### 2.2 文件结构

```
bijingdabaihua.github.io/
├── content/
│   └── posts/              # 现有博客文章
├── data/
│   └── books.json          # 📚 书籍数据源（新增）
├── scripts/
│   ├── import-douban.js    # 豆瓣书单导入脚本（新增）
│   ├── import-weread.js    # 微信读书导入脚本（新增）
│   └── import-csv.js       # CSV 导入脚本（新增）
├── src/
│   ├── app/
│   │   ├── books/          # 📚 /books 页面（新增）
│   │   │   └── page.tsx
│   │   ├── ...             # 现有页面
│   ├── components/
│   │   ├── book-card.tsx   # 📚 书籍卡片组件（新增）
│   │   ├── book-filter.tsx # 📚 筛选组件（新增）
│   │   ├── ...             # 现有组件
│   ├── lib/
│   │   ├── books.ts        # 📚 书籍数据工具（新增）
│   │   ├── constants.ts    # 现有配置（添加导航链接）
│   │   └── ...
│   └── types/
│       └── index.ts        # 添加 Book 类型定义
├── public/
│   └── book-covers/        # 📚 书籍封面图片（可选本地存储）
└── ...
```

## 三、数据模型设计

### 3.1 Book 类型定义

```typescript
// src/types/index.ts

export type BookStatus = 'reading' | 'completed' | 'wishlist' | 'recommended'

export interface Book {
  // 唯一标识
  id: string                    // 唯一ID，建议用 ISBN 或自定义

  // 基本信息（必填）
  title: string                 // 书名
  authors: string[]             // 作者列表

  // 基本信息（可选）
  subtitle?: string             // 副标题
  cover?: string                // 封面图片 URL（本地或外部）
  publisher?: string            // 出版社
  publishYear?: number          // 出版年份
  isbn?: string                 // ISBN
  doubanId?: string            // 豆瓣ID，用于自动获取封面
  pageCount?: number           // 总页数

  // 阅读状态
  status: BookStatus           // reading | completed | wishlist | recommended
  rating?: number              // 个人评分 1-5，支持半星
  progress?: number            // 阅读进度 0-100
  currentPage?: number         // 当前阅读页

  // 时间记录
  startDate?: string           // 开始阅读日期 (YYYY-MM-DD)
  finishDate?: string          // 读完日期 (YYYY-MM-DD)
  addedAt: string              // 添加到书单日期

  // 分类与标签
  categories?: string[]        // 分类：技术、文学、历史等
  tags?: string[]              // 标签

  // 个人记录
  comment?: string             // 简短评论/读后感
  quote?: string               // 精彩摘录
  notesUrl?: string            // 读书笔记链接（可链接到 Garden 笔记）
}
```

### 3.2 状态说明

| 状态 | 含义 | 展示优先级 |
|------|------|-----------|
| `reading` | 正在阅读 | 最高，排在最前面 |
| `completed` | 已读完 | 次高，按完成时间倒序 |
| `recommended` | 喜欢/推荐 | 中等，按评分排序 |
| `wishlist` | 想读 | 最低 |

### 3.3 数据文件示例 (data/books.json)

```json
{
  "books": [
    {
      "id": "978-7-111-54703-0",
      "title": "深入理解计算机系统",
      "subtitle": "Computer Systems: A Programmer's Perspective",
      "authors": ["Randal E. Bryant", "David R. O'Hallaron"],
      "cover": "https://img9.doubanio.com/view/subject/l/public/s2921314.jpg",
      "publisher": "机械工业出版社",
      "publishYear": 2016,
      "isbn": "978-7-111-54703-0",
      "doubanId": "26912767",
      "pageCount": 737,
      "status": "reading",
      "rating": 5,
      "progress": 35,
      "currentPage": 258,
      "startDate": "2025-07-01",
      "addedAt": "2025-07-01",
      "categories": ["技术", "计算机科学"],
      "tags": ["操作系统", "体系结构", "必读"],
      "comment": "被誉为CSAPP，程序员必读经典。从程序员视角理解计算机系统。",
      "notesUrl": "/garden/notes/csapp"
    },
    {
      "id": "978-7-544-27174-6",
      "title": "三体",
      "subtitle": "",
      "authors": ["刘慈欣"],
      "cover": "https://img9.doubanio.com/view/subject/l/public/s2768378.jpg",
      "publisher": "重庆出版社",
      "publishYear": 2008,
      "isbn": "978-7-536-69293-0",
      "doubanId": "2567698",
      "pageCount": 302,
      "status": "completed",
      "rating": 5,
      "progress": 100,
      "startDate": "2025-05-01",
      "finishDate": "2025-05-15",
      "addedAt": "2025-05-01",
      "categories": ["文学", "科幻"],
      "tags": ["雨果奖", "硬科幻", "经典"],
      "comment": "震撼。黑暗森林法则让人不寒而栗，又深感宇宙的壮阔与冷酷。",
      "quote": "弱小和无知不是生存的障碍，傲慢才是。"
    },
    {
      "id": "978-7-111-59293-1",
      "title": "设计模式：可复用面向对象软件的基础",
      "authors": ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"],
      "cover": "",
      "publisher": "机械工业出版社",
      "publishYear": 2019,
      "isbn": "978-7-111-59293-1",
      "doubanId": "30382544",
      "pageCount": 452,
      "status": "wishlist",
      "addedAt": "2025-07-10",
      "categories": ["技术", "软件工程"],
      "tags": ["设计模式", "GoF", "架构"],
      "comment": "GoF 经典，计划下半年阅读。"
    },
    {
      "id": "978-7-111-32680-0",
      "title": "黑客与画家",
      "subtitle": "Hackers and Painters",
      "authors": ["Paul Graham"],
      "cover": "https://img9.doubanio.com/view/subject/l/public/s4669554.jpg",
      "publisher": "人民邮电出版社",
      "publishYear": 2011,
      "isbn": "978-7-115-24948-6",
      "doubanId": "6021440",
      "pageCount": 272,
      "status": "recommended",
      "rating": 4.5,
      "progress": 100,
      "startDate": "2025-03-01",
      "finishDate": "2025-03-10",
      "addedAt": "2025-03-01",
      "categories": ["技术", "随笔"],
      "tags": ["创业", "Lisp", "黑客文化"],
      "comment": "Paul Graham 的文集，关于编程、创业、财富的独特见解。",
      "quote": "优秀的软件作品，本质上是创作过程的结果，而不是工程过程的结果。"
    }
  ]
}
```

## 四、UI 设计

### 4.1 设计理念

与现有博客风格保持完全一致：
- **配色**: 主题色 `#5b7fff`，背景 `#f8f9fa`，卡片白色
- **卡片风格**: 白色背景、圆角 12px、阴影、hover 上浮效果
- **排版**: 系统字体 + PingFang SC，行高 1.8
- **布局**: 最大宽度 860px 居中，响应式

### 4.2 /books 页面布局

```
┌────────────────────────────────────────────────────────────┐
│  Header (导航栏: Home | Garden | Projects | Books | About)  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📚 My Bookshelf                        [搜索框 🔍]       │
│  ─────────────────────                                     │
│                                                            │
│  [全部] [正在阅读 1] [已读完 1] [推荐 1] [想读 1]          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  📖 深入理解计算机系统                              │   │
│  │  ┌────┐  Randal E. Bryant, David R. O'Hallaron     │   │
│  │  │    │  ⭐⭐⭐⭐⭐  35%                            │   │
│  │  │ 📕 │  [████████░░░░░░░░░░░░]                    │   │
│  │  │    │  开始于 2025-07-01 | 读到第 258 页          │   │
│  │  └────┘  技术 · 计算机科学                          │   │
│  │        "从程序员视角理解计算机系统"                  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  📖 三体                                            │   │
│  │  ┌────┐  刘慈欣                                    │   │
│  │  │    │  ⭐⭐⭐⭐⭐  2025-05-15 读完               │   │
│  │  │ 📗 │  文学 · 科幻                                │   │
│  │  │    │  "震撼。黑暗森林法则让人不寒而栗..."        │   │
│  │  └────┘                                             │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ...更多书籍卡片                                           │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Footer                                                    │
└────────────────────────────────────────────────────────────┘
```

### 4.3 书籍卡片设计

**正在阅读状态卡片**（最突出）：
- 左侧：书籍封面图（圆角，固定宽高比 2:3）
- 右侧：
  - 标题（大字号，加粗）
  - 作者（灰色小字）
  - 星级评分
  - 进度条（品牌色填充）
  - 当前页码 / 总页数
  - 分类标签
  - 简短评论

**已读完状态卡片**：
- 类似布局，但进度条替换为"读完日期"
- 显示评分和评论

**想读状态卡片**：
- 更简洁，无进度信息
- 显示"想读"标签

**推荐状态卡片**：
- 突出评分
- 显示摘录（quote）

### 4.4 状态标签颜色

| 状态 | 标签文字 | 背景色 | 文字色 |
|------|---------|--------|--------|
| reading | 正在阅读 | `#5b7fff` | 白色 |
| completed | 已读完 | `#28a745` | 白色 |
| recommended | 推荐 | `#ffc107` | `#343a40` |
| wishlist | 想读 | `#6c757d` | 白色 |

## 五、导入方式设计

### 5.1 方式一：手动编辑 JSON（最基础）

直接编辑 `data/books.json` 文件，push 到 GitHub 后自动部署。

**适用场景**: 少量书籍、偶尔更新
**优点**: 零依赖、最简单
**缺点**: 需要手动填写封面 URL

### 5.2 方式二：豆瓣书单导入（推荐）

**原理**: 通过豆瓣公开 API / 网页抓取获取书籍信息

```bash
# 使用脚本导入豆瓣"读过"列表
node scripts/import-douban.js --user-id 12345678 --list read

# 导入"在读"列表
node scripts/import-douban.js --user-id 12345678 --list reading

# 导入"想读"列表
node scripts/import-douban.js --user-id 12345678 --list wish
```

**脚本功能**:
1. 访问豆瓣用户书单页面
2. 解析每本书的信息（标题、作者、封面、评分等）
3. 自动下载封面图到 `public/book-covers/`
4. 合并到 `data/books.json`

**适用场景**: 豆瓣重度用户，已有大量标记
**优点**: 自动获取完整元数据 + 封面
**注意**: 豆瓣 API 可能有限制，需要处理反爬

### 5.3 方式三：微信读书导入

**原理**: 通过微信读书网页版导出或抓取

```bash
# 从微信读书导入
node scripts/import-weread.js --cookie "your-cookie"
```

**脚本功能**:
1. 访问微信读书书架 API
2. 获取阅读进度、评分等信息
3. 自动匹配豆瓣封面
4. 合并到 `data/books.json`

**适用场景**: 主要用微信读书看书
**优点**: 自动同步阅读进度
**注意**: 需要 Cookie，可能需要定期更新

### 5.4 方式四：CSV/Excel 导入

**格式模板**:
```csv
title,authors,status,rating,progress,startDate,finishDate,categories,comment,isbn
csapp,"Randal E. Bryant,David R. O'Hallaron",reading,5,35,2025-07-01,,"技术,计算机科学",程序员必读,9787111547030
```

```bash
node scripts/import-csv.js --file my-books.csv
```

**适用场景**: 批量导入，从其他平台导出
**优点**: 最通用，任何平台都能导出 CSV

### 5.5 方式五：Obsidian / 数字花园联动（进阶）

利用现有的 Obsidian 数字花园，在笔记中添加 `#book` 标签，自动同步到书单。

```markdown
---
title: 深入理解计算机系统
type: book
status: reading
rating: 5
progress: 35
authors: [Randal E. Bryant, David R. O'Hallaron]
isbn: 978-7-111-54703-0
---

# 深入理解计算机系统

从程序员视角理解计算机系统...
```

## 六、实现步骤

### Phase 1: 核心功能（MVP）

1. **添加 Book 类型定义** (`src/types/index.ts`)
2. **创建书籍数据工具** (`src/lib/books.ts`)
   - 读取 `data/books.json`
   - 按状态排序
   - 按分类/标签过滤
   - 搜索功能
3. **创建书籍卡片组件** (`src/components/book-card.tsx`)
4. **创建 /books 页面** (`src/app/books/page.tsx`)
   - 展示所有书籍
   - 状态筛选标签
   - 搜索框
5. **更新导航栏** (`src/components/header.tsx`)
   - 添加 "Books" 链接
6. **添加示例数据** (`data/books.json`)

### Phase 2: 导入工具

7. **豆瓣导入脚本** (`scripts/import-douban.js`)
8. **微信读书导入脚本** (`scripts/import-weread.js`)
9. **CSV 导入脚本** (`scripts/import-csv.js`)

### Phase 3: 增强功能（可选）

10. 书籍详情页 `/books/[id]`
11. 阅读统计（年度阅读报告）
12. 与 Garden 笔记的双向链接
13. 封面自动抓取（根据 ISBN / 豆瓣ID）

## 七、技术实现要点

### 7.1 纯静态站点的限制与应对

| 限制 | 应对方案 |
|------|---------|
| 无服务端 API | 数据存储在 JSON 文件，构建时读取 |
| 无数据库 | 用 JSON 文件替代 |
| 无法实时更新 | push 后触发 GitHub Actions 重新构建 |
| 无用户认证 | 公开书单，或未来加密码保护页面 |

### 7.2 封面图片处理

**方案 A**: 使用外部 URL（豆瓣图片等）
- 优点: 不增加仓库体积
- 缺点: 外部链接可能失效

**方案 B**: 下载到 `public/book-covers/`
- 优点: 可靠、加载快
- 缺点: 增加仓库体积（GitHub Pages 有 1GB 限制，足够用）

**推荐**: 混合方案
- 导入脚本自动下载封面
- 同时保留外部 URL 作为 fallback
- 定期运行脚本更新

### 7.3 与现有代码风格一致

- 使用 `gray-matter` 解析（如用 Markdown 存储书籍）
- Tailwind CSS v4 样式
- 组件命名: `book-card.tsx`（kebab-case）
- 类型文件: `src/types/index.ts`
- 工具函数: `src/lib/books.ts`

## 八、用户体验设计

### 8.1 访问流程

```
用户打开博客 → 点击导航栏 "Books" → 看到完整书单
                    ↓
         可按状态筛选 / 搜索书名 / 点击书籍查看详情
```

### 8.2 更新流程（以手动 JSON 为例）

```
1. 本地编辑 data/books.json，添加/修改书籍
2. git add . && git commit -m "update books"
3. git push origin main
4. GitHub Actions 自动构建部署
5. 约 1-2 分钟后，网站更新
```

### 8.3 移动端适配

- 书籍卡片在移动端变为纵向布局（封面在上，信息在下）
- 筛选标签支持横向滚动
- 搜索框全宽

## 九、扩展可能性

1. **年度阅读报告**: 自动统计每年的阅读数量、页数、评分分布
2. **阅读热力图**: 类似 GitHub contributions 的阅读记录热力图
3. **读书笔记联动**: 每本书关联到 Garden 中的读书笔记
4. **书单分享**: 生成可分享的精美书单图片
5. **RSS 订阅**: 新增书籍时推送 RSS

---

## 十、总结

这个设计方案的核心思想是：**以 JSON 文件为中心，多种方式导入，静态生成展示**。

**推荐的使用流程**:
1. **第一次**: 用豆瓣导入脚本批量导入已有书单
2. **日常**: 手动编辑 `data/books.json` 添加新书，或用微信读书脚本定期同步
3. **展示**: 访问 `/books` 页面即可看到完整书单，支持筛选和搜索

整个方案不需要任何后端服务，完美适配现有的 GitHub Pages 静态部署架构。
