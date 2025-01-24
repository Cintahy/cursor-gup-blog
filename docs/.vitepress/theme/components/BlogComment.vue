<template>
  <div class="blog-comment">
    <div class="comment-header">
      <h3 class="comment-title">
        <i class="iconfont icon-comment"></i>
        评论
      </h3>
    </div>
    
    <div 
      ref="commentRef"
      class="giscus-wrapper"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData, useRoute } from 'vitepress'

const { theme } = useData()
const route = useRoute()
const commentRef = ref<HTMLElement>()

// 加载 Giscus
function loadGiscus() {
  if (!commentRef.value) return

  // 移除已存在的 giscus 容器
  const oldScript = document.querySelector('.giscus-script')
  if (oldScript) oldScript.remove()
  const giscusFrame = document.querySelector('iframe.giscus-frame')
  if (giscusFrame) giscusFrame.remove()

  // 创建新的 script 元素
  const script = document.createElement('script')
  script.className = 'giscus-script'
  script.src = 'https://giscus.app/client.js'
  script.dataset.repo = theme.value.comment?.repo || ''
  script.dataset.repoId = theme.value.comment?.repoId || ''
  script.dataset.category = theme.value.comment?.category || ''
  script.dataset.categoryId = theme.value.comment?.categoryId || ''
  script.dataset.mapping = 'pathname'
  script.dataset.strict = '0'
  script.dataset.reactionsEnabled = '1'
  script.dataset.emitMetadata = '0'
  script.dataset.inputPosition = 'top'
  script.dataset.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  script.dataset.lang = 'zh-CN'
  script.crossOrigin = 'anonymous'
  script.async = true

  commentRef.value.appendChild(script)
}

// 监听主题变化
function handleThemeChange() {
  const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (giscusFrame) {
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    giscusFrame.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  loadGiscus()
  
  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        handleThemeChange()
      }
    })
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})
</script>

<style scoped>
.blog-comment {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.comment-header {
  margin-bottom: 2rem;
}

.comment-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.giscus-wrapper {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

/* 深色模式 */
:root.dark .giscus-wrapper {
  background: var(--vp-c-bg-soft);
}

@media (max-width: 768px) {
  .blog-comment {
    margin-top: 3rem;
    padding-top: 1.5rem;
  }

  .comment-title {
    font-size: 1.25rem;
  }
}
</style> 