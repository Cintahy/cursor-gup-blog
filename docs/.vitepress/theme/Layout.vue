<template>
  <Layout>
    <template #layout-bottom>
      <BackToTop />
      <ImagePreview ref="imagePreviewRef" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './components/BackToTop.vue'
import ImagePreview from './components/ImagePreview.vue'

const { Layout } = DefaultTheme
const imagePreviewRef = ref()

// 注册全局图片预览方法
onMounted(() => {
  window.$imagePreview = imagePreviewRef.value
})
</script>

<script lang="ts">
// 声明全局类型
declare global {
  interface Window {
    $imagePreview?: {
      open: (src: string) => void
      close: () => void
    }
  }
}
</script> 