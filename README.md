# 个人博客

基于 [Mizuki](https://github.com/LyraVoid/Mizuki) 主题搭建的个人博客，用于记录技术学习、项目实践和生活想法。

托管于 GitHub Pages，通过 GitHub Actions 自动构建部署。

## 技术栈

- **Mizuki** — Material Design 3 博客主题
- **Astro 6** — 静态站点生成器
- **Svelte 5 + Tailwind CSS 4** — 前端交互与样式
- **pnpm** — 包管理器
- **GitHub Pages + Actions** — 托管与自动部署

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 本地启动开发服务器 (localhost:3000)
pnpm build            # 构建生产版本
pnpm preview          # 本地预览构建结果
pnpm check            # 类型检查
```

## 写文章

文章存放在 `src/content/posts/` 目录下，每篇文章一个文件夹，内含 `index.md`：

```
src/content/posts/
└── hello-world/
    └── index.md
```

文章 frontmatter 格式：

```md
---
title: 文章标题
published: 2026-05-23
description: 文章摘要。
tags: [标签1, 标签2]
category: 分类名
---

正文内容。
```

## 目录结构

```
src/content/posts/        # 博客文章
src/content/spec/         # 独立页面（关于、友链等）
src/config/               # 站点配置（标题、头像、导航、社交链接等）
src/assets/images/        # 头像等资源
public/assets/            # 壁纸、字体等静态资源
.github/workflows/        # Actions 自动部署
```

## 关键配置

站点核心设置在 `src/config/siteConfig.ts`：
- 站点标题、副标题、URL
- 主题色相 (`themeColor.hue`)
- 壁纸模式 (`wallpaperMode.defaultMode`)
- 首页 Banner 图片与文字

个人资料在 `src/config/profileConfig.ts`：
- 头像、昵称、简介
- 社交链接（GitHub、Bilibili、Gitee、AtCoder 等）

导航栏在 `src/config/navBarConfig.ts`。

## 发布

推送 main 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

首次使用需在仓库 Settings → Pages 中将 Source 设为 GitHub Actions。
