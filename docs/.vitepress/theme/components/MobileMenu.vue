<template>
  <div class="mobile-menu">
    <!-- 菜单触发按钮 -->
    <button 
      class="menu-trigger"
      :class="{ active: isOpen }"
      @click="toggleMenu"
      aria-label="菜单"
    >
      <div class="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- 菜单内容 -->
    <Transition name="menu">
      <div v-if="isOpen" class="menu-content">
        <!-- 搜索框 -->
        <div class="menu-search">
          <BlogSearch />
        </div>

        <!-- 导航链接 -->
        <nav class="menu-nav">
          <a 
            v-for="item in nav" 
            :key="item.link"
            :href="item.link"
            class="menu-link"
            :class="{ active: currentPath === item.link }"
            @click="closeMenu"
          >
            {{ item.text }}
          </a>
        </nav>

        <!-- 分类和标签 -->
        <div class="menu-section">
          <h3 class="section-title">分类</h3>
          <div class="menu-categories">
            <a 
              v-for="category in categories"
              :key="category.name"
              :href="category.path"
              class="category-link"
              @click="closeMenu"
            >
              {{ category.name }}
              <span class="count">({{ category.count }})</span>
            </a>
          </div>
        </div>

        <div class="menu-section">
          <h3 class="section-title">标签</h3>
          <div class="menu-tags">
            <a 
              v-for="tag in tags"
              :key="tag.name"
              :href="tag.path"
              class="tag-link"
              @click="closeMenu"
            >
              {{ tag.name }}
              <span class="count">({{ tag.count }})</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="menu-mask"
        @click="closeMenu"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import BlogSearch from './BlogSearch.vue'

const { theme } = useData()
const route = useRoute()

const isOpen = ref(false)
const nav = computed(() => theme.value.nav || [])
const currentPath = computed(() => route.path)

// 获取分类和标签数据
const categories = computed(() => theme.value.categories || [])
const tags = computed(() => theme.value.tags || [])

function toggleMenu() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  isOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.mobile-menu {
  display: none;
}

.menu-trigger {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.menu-icon {
  position: relative;
  width: 20px;
  height: 14px;
  margin: 0 auto;
}

.menu-icon span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--vp-c-text-1);
  transition: all 0.3s;
  transform-origin: center;
}

.menu-icon span:nth-child(1) {
  top: 0;
}

.menu-icon span:nth-child(2) {
  top: 6px;
  opacity: 1;
}

.menu-icon span:nth-child(3) {
  bottom: 0;
}

.menu-trigger.active .menu-icon span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-trigger.active .menu-icon span:nth-child(2) {
  opacity: 0;
}

.menu-trigger.active .menu-icon span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.menu-content {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vp-c-bg);
  padding: 1rem;
  z-index: 100;
  overflow-y: auto;
}

.menu-search {
  margin-bottom: 1rem;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.menu-link {
  display: block;
  padding: 0.8rem 1rem;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s;
}

.menu-link:hover,
.menu-link.active {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

.menu-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.menu-categories,
.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-link,
.tag-link {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  transition: all 0.3s;
}

.category-link:hover,
.tag-link:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-mute);
}

.count {
  font-size: 0.8rem;
  opacity: 0.7;
}

.menu-mask {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* 动画效果 */
.menu-enter-active,
.menu-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .mobile-menu {
    display: block;
  }
}
</style> 