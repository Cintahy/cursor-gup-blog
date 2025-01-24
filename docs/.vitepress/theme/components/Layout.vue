<template>
  <div class="theme-container">
    <BlogHeader />
    
    <main class="main">
      <!-- 首页布局 -->
      <HomeLayout v-if="frontmatter.layout === 'home'" />
      
      <!-- 文章布局 -->
      <BlogPost v-else-if="isPost" />
      
      <!-- 默认布局 -->
      <div v-else class="content">
        <Content />
      </div>
    </main>

    <BlogFooter />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import BlogHeader from './BlogHeader.vue'
import BlogFooter from './BlogFooter.vue'
import HomeLayout from './HomeLayout.vue'
import BlogPost from './BlogPost.vue'
import BackToTop from './BackToTop.vue'

const { page, frontmatter } = useData()

const isPost = computed(() => {
  return page.value.relativePath.startsWith('posts/') && 
         page.value.relativePath !== 'posts/index.md'
})
</script>

<style scoped>
.theme-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  margin-top: var(--vp-nav-height);
  padding-top: 2rem;
}

.content {
  max-width: var(--vp-content-max-width);
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .main {
    padding-top: 1rem;
  }
  
  .content {
    padding: 0 16px;
  }
}
</style> 