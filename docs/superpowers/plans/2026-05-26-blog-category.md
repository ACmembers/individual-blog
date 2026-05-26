# Blog Category Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-category navigation (算法 / 408 / 数学 / 开发) to the blog with dedicated category pages and a global navigation bar.

**Architecture:** Extend the Astro content collection schema with a required `category` field constrained to four enum values. Add a global navigation bar in the shared `BaseLayout`. Replace the home page article list with category entry cards. Add a dynamic `[category].astro` route to render per-category article listings.

**Tech Stack:** Astro 5.x, TypeScript, Markdown content collections, CSS.

---

## File Structure

- Modify: `src/content/config.ts` — add required `category` enum field
- Modify: `src/content/blog/hello-world.md` — add category to frontmatter
- Modify: `src/layouts/BaseLayout.astro` — add global nav bar with active-link state
- Modify: `src/pages/index.astro` — replace article list with category entry cards
- Modify: `src/styles/global.css` — add nav bar, active link, and category-card styles
- Create: `src/pages/blog/category/[category].astro` — dynamic category page
- Create: `src/lib/categories.ts` — single source of truth for category list

## Task 1: Define Category Constants

**Files:**
- Create: `src/lib/categories.ts`

- [ ] **Step 1: Create `src/lib/categories.ts`**

Write this file:

```ts
export const CATEGORIES = ['算法', '408', '数学', '开发'] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  算法: '数据结构与算法学习笔记。',
  '408': '计算机考研 408 复习记录。',
  数学: '数学相关学习与思考。',
  开发: '工程实践、工具与项目记录。'
};
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

## Task 2: Add Category to Content Schema

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Replace the file content**

Write `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../lib/categories';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog };
```

- [ ] **Step 2: Run check; expect failure**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: failure on `src/content/blog/hello-world.md` because it lacks a `category` field. This is the failing test.

## Task 3: Add Category to Existing Post

**Files:**
- Modify: `src/content/blog/hello-world.md`

- [ ] **Step 1: Add category to frontmatter**

Edit `src/content/blog/hello-world.md` so the frontmatter is:

```md
---
title: 第一篇博客
description: 记录这个个人博客的开始。
pubDate: 2026-05-23
category: 开发
tags: [随笔, 博客]
---
```

Body content unchanged.

- [ ] **Step 2: Run check; expect pass**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

## Task 4: Add Global Navigation Bar

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace BaseLayout content**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import { CATEGORIES } from '../lib/categories';

interface Props {
  title: string;
  description?: string;
  activePath?: string;
}

const { title, description = '个人博客', activePath = '' } = Astro.props;
const base = import.meta.env.BASE_URL;

const navLinks = [
  { label: '首页', href: base, key: 'home' },
  ...CATEGORIES.map((c) => ({
    label: c,
    href: `${base}blog/category/${encodeURIComponent(c)}/`,
    key: `category:${c}`
  }))
];
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
    <title>{title}</title>
  </head>
  <body style={`--bg-image: url('${base}background.jpg')`}>
    <header class="site-header">
      <div class="container">
        <h1 class="site-title"><a href={base}>个人博客</a></h1>
        <p class="site-description">记录技术、生活和思考。</p>
      </div>
    </header>
    <nav class="site-nav">
      <div class="container site-nav__inner">
        {navLinks.map((link) => (
          <a
            href={link.href}
            class:list={['site-nav__link', { 'is-active': link.key === activePath }]}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
    <main class="container">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="container">保持简单，持续记录。</div>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Run check**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

## Task 5: Add Nav and Category Card Styles

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append new styles to the end of `src/styles/global.css`**

Add this CSS block at the end of the file (after the existing responsive media query):

```css
/* Site Nav */
.site-nav {
  margin-top: calc(-1 * var(--space-2xl));
  margin-bottom: var(--space-2xl);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-card);
}

.site-nav__inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

.site-nav__link {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  padding: var(--space-xs) var(--space-md);
  border-radius: 999px;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.site-nav__link:hover {
  color: var(--color-accent);
  background: var(--color-tag-bg);
}

.site-nav__link.is-active {
  color: #fff;
  background: var(--color-accent);
}

/* Category Cards (home page) */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  margin-top: var(--space-2xl);
}

.category-card {
  display: block;
  padding: var(--space-xl);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  color: var(--color-text);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.category-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
  color: var(--color-text);
}

.category-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.category-card__desc {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}

/* Category Page Heading */
.category-heading {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.75rem;
  margin-bottom: var(--space-md);
}

.category-empty {
  color: var(--color-text-muted);
  padding: var(--space-2xl) 0;
  text-align: center;
}

@media (max-width: 640px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .site-nav__inner {
    gap: var(--space-sm);
  }

  .site-nav__link {
    font-size: 0.9rem;
    padding: 4px var(--space-sm);
  }
}
```

- [ ] **Step 2: Run check**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

## Task 6: Replace Home Page With Category Cards

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the file content**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from '../lib/categories';

const base = import.meta.env.BASE_URL;
---

<BaseLayout title="个人博客" description="记录技术、生活和思考的个人博客。" activePath="home">
  <section>
    <p class="prose">这里是我的个人博客，用来记录技术学习、项目实践、生活想法和阶段性总结。下面按目录浏览。</p>
  </section>

  <section class="category-grid">
    {CATEGORIES.map((c) => (
      <a class="category-card" href={`${base}blog/category/${encodeURIComponent(c)}/`}>
        <h2 class="category-card__title">{c}</h2>
        <p class="category-card__desc">{CATEGORY_DESCRIPTIONS[c]}</p>
      </a>
    ))}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Run check**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

## Task 7: Add Dynamic Category Page

**Files:**
- Create: `src/pages/blog/category/[category].astro`

- [ ] **Step 1: Create the file**

Write `src/pages/blog/category/[category].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { CATEGORIES, type Category } from '../../../lib/categories';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');

  return CATEGORIES.map((category) => {
    const posts = allPosts
      .filter((p) => p.data.category === category)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return {
      params: { category },
      props: { category, posts }
    };
  });
}

interface Props {
  category: Category;
  posts: Awaited<ReturnType<typeof getCollection<'blog'>>>;
}

const { category, posts } = Astro.props;
const base = import.meta.env.BASE_URL;

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
---

<BaseLayout
  title={`${category} - 个人博客`}
  description={`分类：${category}`}
  activePath={`category:${category}`}
>
  <section>
    <h1 class="category-heading">{category}</h1>
  </section>

  <section>
    {posts.length === 0 ? (
      <p class="category-empty">这个分类暂时还没有文章。</p>
    ) : (
      posts.map((post) => (
        <article class="article-card">
          <h2 class="article-card__title">
            <a href={`${base}blog/${post.slug}/`}>{post.data.title}</a>
          </h2>
          <p class="article-card__date">{formatDate(post.data.pubDate)}</p>
          <p class="article-card__excerpt">{post.data.description}</p>
          <div class="article-card__tags">
            {post.data.tags.map((tag) => <span class="tag-pill">{tag}</span>)}
          </div>
        </article>
      ))
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Run check**

Run:
```bash
./node_modules/.bin/astro check
```
Expected: 0 errors.

- [ ] **Step 3: Run build**

Run:
```bash
./node_modules/.bin/astro build
```
Expected: build succeeds. The `dist/` folder should contain `index.html`, `blog/hello-world/index.html`, and one folder per category under `blog/category/` with `index.html` inside (e.g. `blog/category/算法/index.html`). The `开发` folder will list `hello-world` since it was assigned to `开发`.

- [ ] **Step 4: Verify generated category pages**

Run:
```bash
ls dist/blog/category/
```
Expected: 4 directories — `算法`, `408`, `数学`, `开发`.

## Task 8: Update Article Detail Page Active Nav

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Pass active path based on post category**

Replace the content of `src/pages/blog/[slug].astro`:

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

<BaseLayout
  title={`${post.data.title} - 个人博客`}
  description={post.data.description}
  activePath={`category:${post.data.category}`}
>
  <article>
    <p><a href={import.meta.env.BASE_URL}>← 返回首页</a></p>
    <h1 class="article-card__title">{post.data.title}</h1>
    <p class="article-card__date">{formattedDate}</p>
    <div class="article-card__tags">
      {post.data.tags.map((tag) => <span class="tag-pill">{tag}</span>)}
    </div>
    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Run final check and build**

Run:
```bash
./node_modules/.bin/astro check && ./node_modules/.bin/astro build
```
Expected: 0 errors and successful build with 7 pages (1 home, 1 hello-world, 4 categories, 1 default category index is NOT generated — only the 4 from `getStaticPaths`).

## Task 9: Commit and Push

**Files:**
- All staged files from above.

- [ ] **Step 1: Stage and commit**

Run:
```bash
git add src/lib src/content/config.ts src/content/blog/hello-world.md src/layouts/BaseLayout.astro src/pages/index.astro src/pages/blog/category src/pages/blog/[slug].astro src/styles/global.css
git commit -m "feat: add four-category navigation (算法/408/数学/开发)"
```

- [ ] **Step 2: Push**

Run:
```bash
git push
```
Expected: GitHub Actions deploy workflow triggers successfully.

## Self-Review

- **Spec coverage:**
  - Content model: Task 2 (schema) + Task 3 (existing post) ✓
  - Home page: Task 6 ✓
  - Category page: Task 7 ✓
  - Article detail page: Task 8 ✓
  - Navigation: Task 4 + Task 5 ✓
  - Fixed category list: Task 1 (single source of truth) ✓
- **Placeholder scan:** All steps include real code, no TBDs.
- **Type consistency:**
  - `CATEGORIES` defined once in `src/lib/categories.ts` and reused in schema, BaseLayout, index, and category page.
  - `activePath` prop name consistent across BaseLayout, index, category page, and post detail page.
  - URL pattern `${base}blog/category/${encodeURIComponent(c)}/` consistent in nav and home cards; matches the route directory `src/pages/blog/category/[category].astro`.
