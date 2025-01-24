<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-left">
        <a href="/" class="logo-link">{{ siteTitle }}</a>
      </div>
      
      <div class="nav-center">
        <a 
          v-for="item in nav" 
          :key="item.link"
          :href="item.link"
          class="nav-link"
          :class="{ active: currentPath === item.link }"
        >
          {{ item.text }}
        </a>
      </div>
      
      <div class="nav-right">
        <button class="theme-toggle" @click="toggleTheme" title="切换主题">
          <div class="icon">{{ isDark ? '🌙' : '☀️' }}</div>
        </button>
        <BlogSearch />
        <MobileMenu class="mobile-menu" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, ref, watch, onMounted } from 'vue'
import BlogSearch from './BlogSearch.vue'
import MobileMenu from './MobileMenu.vue'

const { theme } = useData()
const route = useRoute()

// 使用 ref 跟踪主题状态
const isDark = ref(false)

// 初始化和同步主题状态
onMounted(() => {
  // 获取当前主题
  const userPreference = localStorage.getItem('vitepress-theme-appearance') || 'auto'
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = userPreference === 'dark' || (userPreference === 'auto' && systemDark)

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('vitepress-theme-appearance') === 'auto') {
      isDark.value = e.matches
      updateTheme()
    }
  })
})

// 切换主题
function toggleTheme() {
  isDark.value = !isDark.value
  updateTheme()
}

// 更新主题
function updateTheme() {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('vitepress-theme-appearance', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('vitepress-theme-appearance', 'light')
  }
}

// 监听主题变化
watch(isDark, (newValue) => {
  updateTheme()
})

const siteTitle = computed(() => theme.value.siteTitle || '我的博客')
const nav = computed(() => theme.value.nav || [])
const currentPath = computed(() => route.path)
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--vp-nav-height);
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  transition: border-color 0.5s, background-color 0.5s;
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: var(--vp-nav-height);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-link {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 8px 12px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.25s, background-color 0.25s;
  border-radius: 6px;
}

.nav-link:hover,
.nav-link.active {
  color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-dimm);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;
}

.theme-toggle:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.icon {
  font-size: 1.2rem;
  transition: transform 0.25s;
}

.theme-toggle:hover .icon {
  transform: rotate(15deg);
}

@media (max-width: 768px) {
  .nav {
    padding: 0 16px;
  }

  .nav-center {
    display: none;
  }
  
  .logo-link {
    font-size: 1.1rem;
  }
}
</style> 