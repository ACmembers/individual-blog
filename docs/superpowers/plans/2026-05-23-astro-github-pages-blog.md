# Astro GitHub Pages Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal static blog using Astro, Markdown, and GitHub Pages.

**Architecture:** The site uses Astro as a static site generator. Blog posts live as Markdown content entries, Astro generates the home page, article list, and individual article pages, and GitHub Actions deploys the static build output to GitHub Pages.

**Tech Stack:** Astro, TypeScript, Markdown, CSS, GitHub Pages, GitHub Actions.

---

## File Structure

- Create: `package.json` — project scripts and dependencies.
- Create: `astro.config.mjs` — Astro config with GitHub Pages-compatible site/base values.
- Create: `tsconfig.json` — Astro TypeScript config.
- Create: `src/content/config.ts` — blog content collection schema.
- Create: `src/content/blog/hello-world.md` — first sample blog post.
- Create: `src/layouts/BaseLayout.astro` — shared HTML shell, metadata, and global layout.
- Create: `src/pages/index.astro` — blog home page listing posts.
- Create: `src/pages/blog/[slug].astro` — generated detail page for each post.
- Create: `src/styles/global.css` — minimal personal blog styling.
- Create: `public/favicon.svg` — simple favicon.
- Create: `.github/workflows/deploy.yml` — GitHub Pages deployment workflow.
- Modify: `README.md` — align commands and article workflow with actual Astro project.

## Task 1: Initialize Astro Project Files

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "astro": "latest",
    "typescript": "latest"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-github-username.github.io',
  base: '/personal-blog/'
});
```

After creating the GitHub repository, replace `your-github-username` with the real GitHub username and `personal-blog` with the repository name.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 5: Verify Astro command is available**

Run:

```bash
npm run check
```

Expected: Astro starts type checking. It may fail because no `src` files exist yet; that is acceptable at this task stage.

## Task 2: Add Blog Content Collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/hello-world.md`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog };
```

- [ ] **Step 2: Create `src/content/blog/hello-world.md`**

```md
---
title: 第一篇博客
description: 记录这个个人博客的开始。
pubDate: 2026-05-23
tags: [随笔, 博客]
---

这是我的第一篇博客文章。

这个博客会用来记录技术学习、项目实践、生活想法和阶段性总结。
```

- [ ] **Step 3: Run content type check**

Run:

```bash
npm run check
```

Expected: It may still fail because pages and layouts do not exist yet. There should be no schema error for `hello-world.md`.

## Task 3: Add Shared Layout and Global Styles

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
:root {
  color-scheme: light;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1f2933;
  background: #f8fafc;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f8fafc;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.container {
  width: min(760px, calc(100% - 32px));
  margin: 0 auto;
}

.site-header {
  padding: 32px 0 20px;
}

.site-title {
  margin: 0;
  font-size: 28px;
}

.site-description {
  margin: 8px 0 0;
  color: #64748b;
}

main {
  padding: 24px 0 56px;
}

.article-list {
  display: grid;
  gap: 18px;
  padding: 0;
  list-style: none;
}

.article-card {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
}

.article-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.article-meta {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 13px;
}

.prose {
  line-height: 1.8;
  font-size: 17px;
}

.prose h1 {
  line-height: 1.25;
}

.site-footer {
  padding: 24px 0 40px;
  color: #64748b;
  font-size: 14px;
}
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '个人博客' } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
    <title>{title}</title>
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <h1 class="site-title"><a href={import.meta.env.BASE_URL}>个人博客</a></h1>
        <p class="site-description">记录技术、生活和思考。</p>
      </div>
    </header>
    <main class="container">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="container">保持简单，持续记录。</div>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#2563eb"/>
  <path d="M18 20h28v5H18zm0 10h28v5H18zm0 10h18v5H18z" fill="#fff"/>
</svg>
```

## Task 4: Add Home Page and Blog Detail Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
---

<BaseLayout title="个人博客" description="记录技术、生活和思考的个人博客。">
  <section>
    <p class="prose">这里是我的个人博客，用来记录技术学习、项目实践、生活想法和阶段性总结。</p>
  </section>

  <section>
    <h2>文章</h2>
    <ul class="article-list">
      {posts.map((post) => (
        <li class="article-card">
          <h2><a href={`${import.meta.env.BASE_URL}blog/${post.slug}/`}>{post.data.title}</a></h2>
          <p class="article-meta">{formatDate(post.data.pubDate)}</p>
          <p>{post.data.description}</p>
          <div class="tags">
            {post.data.tags.map((tag) => <span class="tag">{tag}</span>)}
          </div>
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

const formattedDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(post.data.pubDate);
---

<BaseLayout title={`${post.data.title} - 个人博客`} description={post.data.description}>
  <article class="prose">
    <p><a href={import.meta.env.BASE_URL}>← 返回首页</a></p>
    <h1>{post.data.title}</h1>
    <p class="article-meta">{formattedDate}</p>
    <div class="tags">
      {post.data.tags.map((tag) => <span class="tag">{tag}</span>)}
    </div>
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Run Astro check**

Run:

```bash
npm run check
```

Expected: `Result (1 file): No issues found` or equivalent Astro success output.

- [ ] **Step 4: Build site**

Run:

```bash
npm run build
```

Expected: Astro exits with code 0 and creates `dist/`.

## Task 5: Add GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Document GitHub Pages setting**

After pushing to GitHub, open repository settings and configure Pages source to `GitHub Actions`.

- [ ] **Step 3: Commit deployment files**

Run:

```bash
git add .github/workflows/deploy.yml astro.config.mjs package.json package-lock.json src public tsconfig.json README.md
git commit -m "feat: initialize Astro blog for GitHub Pages"
```

Expected: New commit is created. If the repository is not initialized yet, first run `git init`, create the GitHub repository, and set the remote.

## Task 6: Update README for Actual Workflow

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the generic content organization section with Astro paths**

Use this content in `README.md`:

```md
## 内容整理

```text
src/content/blog/     # 博客文章，使用 Markdown 编写
src/pages/            # 页面入口：首页、文章详情页
src/layouts/          # 页面布局
src/styles/           # 全局样式
public/               # 静态资源，例如 favicon、公开图片
.github/workflows/    # GitHub Pages 自动部署配置
```
```

- [ ] **Step 2: Replace the write article workflow with Astro-specific steps**

Use this content in `README.md`:

```md
## 写文章流程

1. 在 `src/content/blog/` 下新建 Markdown 文件。
2. 在文件开头填写文章信息。
3. 编写正文内容。
4. 执行 `npm run dev` 本地预览。
5. 确认无误后提交并推送到 GitHub。

文章示例：

```md
---
title: 第一篇博客
description: 记录这个个人博客的开始。
pubDate: 2026-05-23
tags: [随笔, 博客]
---

这是正文内容。
```
```

- [ ] **Step 3: Run final verification commands**

Run:

```bash
npm run check
npm run build
```

Expected: Both commands exit with code 0.

## Self-Review

- Spec coverage: The plan initializes an Astro static blog, supports Markdown posts, adds local commands, adds GitHub Pages deployment, and updates README for personal use.
- Placeholder scan: The only values requiring user replacement are the GitHub username and repository name in `astro.config.mjs`; the plan explicitly states how to replace them.
- Type consistency: Content fields are consistently named `title`, `description`, `pubDate`, and `tags` across schema, Markdown, index page, and detail page.
