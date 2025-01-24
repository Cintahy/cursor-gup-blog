<template>
  <div class="latest-posts-grid">
    <BlogPostCard 
      v-for="post in latestPosts" 
      :key="post.url" 
      :post="post"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import BlogPostCard from './BlogPostCard.vue'

const { theme } = useData()

const latestPosts = computed(() => {
  const posts = theme.value.posts || []
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6) // 只显示最新的6篇文章
})
</script>

<style scoped>
.latest-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .latest-posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style> 