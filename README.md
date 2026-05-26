# 个人博客

这是我的个人博客项目，用来记录技术学习、项目实践、生活想法和一些阶段性的总结。

这个 README 主要作为个人使用备忘，方便之后快速回到项目、写文章、启动预览和发布博客。

## 技术栈

- Astro：静态站点生成器
- Markdown：编写博客文章
- GitHub Pages：免费托管博客
- GitHub Actions：自动构建和部署

## 常用命令

```bash
# 安装依赖
npm install --ignore-scripts

# 本地启动
npm run dev

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview

# 类型检查
npm run check
```

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

## 内容整理

```text
src/content/blog/     # 博客文章，使用 Markdown 编写
src/pages/            # 页面入口：首页、文章详情页
src/layouts/          # 页面布局
src/styles/           # 全局样式
public/               # 静态资源，例如 favicon、公开图片
.github/workflows/    # GitHub Pages 自动部署配置
```

## GitHub Pages 发布

博客通过 GitHub Actions 自动部署到 GitHub Pages。

基本流程：

1. 本地完成文章编写和预览。
2. 提交并推送到 GitHub 的 main 分支。
3. GitHub Actions 自动构建并部署。

首次配置：

1. 在 GitHub 仓库设置中开启 Pages，来源选择 GitHub Actions。
2. 在 `astro.config.mjs` 中将 `site` 和 `base` 替换为实际的 GitHub 用户名和仓库名。

## 发布前检查

发布前可以简单检查：

- 文章标题是否正确
- 日期、分类、标签是否填写
- 图片是否能正常显示
- 内部链接和外部链接是否可访问
- 本地构建是否成功
- GitHub Pages 发布配置是否正确

## 个人备忘

- 文章内容优先保持清晰，不追求复杂排版。
- 图片尽量压缩后再上传。
- 定期整理旧文章的分类和标签。
- 有新想法可以先写草稿，不必一次写完。

## 关于

这个博客是我长期记录和整理自己的地方。比起追求复杂功能，更希望它简单、稳定、方便维护。
