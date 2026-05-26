# Blog Category Feature Design

**Goal:** Add a category system to the blog with four fixed categories: 算法, 408, 数学, 开发. Each category gets its own page listing articles, and a global navigation bar links to all categories. The home page is repurposed as a landing page with an intro and four category entry cards instead of a full article list.

## Content Model

Add a `category` field to the blog content collection schema in `src/content/config.ts`:

- Type: enum, one of `算法 | 408 | 数学 | 开发`
- Required: every blog post must specify a category
- Tags remain unchanged (free-form, optional)

Existing `hello-world.md` will be updated to include a category value.

## Pages

**Home page (`src/pages/index.astro`):**
- Remove the current article list
- Show a blog intro paragraph
- Show four category entry cards, each linking to its category page

**Category page (`src/pages/blog/category/[category].astro`):**
- Dynamic route generating one page per category
- Lists all posts in that category, sorted by date descending
- Uses the same article-card layout as the current home page

**Article detail page (`src/pages/blog/[slug].astro`):**
- No structural changes; the category will already be in frontmatter data

## Navigation

Add a global top navigation bar in `src/layouts/BaseLayout.astro`:
- Links: 首页 / 算法 / 408 / 数学 / 开发
- Current page highlighted (active state)
- Positioned between the site header and the main content

## Categories (fixed list)

| Value   | Label  | URL                                |
|---------|--------|------------------------------------|
| 算法    | 算法   | `/blog/category/算法/`             |
| 408     | 408    | `/blog/category/408/`              |
| 数学    | 数学   | `/blog/category/数学/`             |
| 开发    | 开发   | `/blog/category/开发/`             |

## Files to Modify

- `src/content/config.ts` — add category enum to schema
- `src/content/blog/hello-world.md` — add category frontmatter
- `src/layouts/BaseLayout.astro` — add navigation bar
- `src/pages/index.astro` — replace article list with category cards
- `src/styles/global.css` — nav bar styles, category card styles

## Files to Create

- `src/pages/blog/category/[category].astro` — dynamic category page
