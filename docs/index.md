---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: 我的博客

hero:
  name: 我的博客
  text: 基于 VitePress 的个人博客
  tagline: 分享技术与生活
  image:
    src: /public/logo.png
    alt: 博客 Logo
  actions:
    - theme: brand
      text: 开始阅读
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about/

features:
  - icon: 📝
    title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置专注于写作。
    
  - icon: ⚡️
    title: 高性能
    details: VitePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
    
  - icon: 🛠️
    title: 功能丰富
    details: 支持代码高亮、全文搜索、文章分类、标签管理等多种功能。
    
  - icon: 🎨
    title: 主题定制
    details: 支持深色模式，可自定义主题色彩和布局样式。
    
  - icon: 📱
    title: 响应式设计
    details: 完美适配桌面端和移动端，提供最佳阅读体验。
    
  - icon: 🚀
    title: 持续更新
    details: 持续改进功能和性能，定期更新内容。

---

<script setup>
import { useData } from 'vitepress'
import BlogStats from '.vitepress/theme/components/BlogStats.vue'
import LatestPosts from '.vitepress/theme/components/LatestPosts.vue'
</script>

<BlogStats class="blog-stats" />

<div class="latest-posts">
  <h2 class="section-title">最新文章</h2>
  <LatestPosts />
</div>

<style scoped>
.blog-stats {
  margin: 2rem auto;
  max-width: var(--vp-layout-max-width);
  padding: 0 24px;
}

.latest-posts {
  margin: 4rem auto;
  max-width: var(--vp-layout-max-width);
  padding: 0 24px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--vp-c-text-1);
  text-align: center;
}

@media (max-width: 768px) {
  .blog-stats,
  .latest-posts {
    padding: 0 16px;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>

