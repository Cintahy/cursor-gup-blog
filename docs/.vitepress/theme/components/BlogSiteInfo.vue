<template>
  <div class="site-info" :class="{ 'is-hovering': isHovering }">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 头像区域 -->
    <div class="avatar-container" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
      <div class="avatar-wrap">
        <img 
          :src="theme.profile.avatar" 
          :alt="theme.profile.name"
          class="avatar"
        >
        <div class="avatar-ring"></div>
      </div>
      <div class="status-badge" title="在线">
        <span class="status-dot"></span>
      </div>
    </div>
    
    <!-- 个人信息 -->
    <div class="info-content">
      <h2 class="name">
        {{ theme.profile.name }}
        <span class="verified-badge" title="已认证">
          <i class="iconfont icon-verified"></i>
        </span>
      </h2>
      
      <div class="description">
        <TypeWriter 
          :texts="theme.profile.description"
          :interval="3000"
          :typeSpeed="80"
        />
      </div>

      <!-- 社交链接 -->
      <div class="social-links">
        <a 
          v-for="(url, platform) in theme.profile.social"
          :key="platform"
          :href="url"
          class="social-link"
          :class="platform"
          target="_blank"
          rel="noopener noreferrer"
          :title="platform"
        >
          <i :class="getSocialIcon(platform)"></i>
          <span class="tooltip">{{ platform }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import TypeWriter from './TypeWriter.vue'

const { theme } = useData()
const isHovering = ref(false)

function getSocialIcon(platform: string) {
  const icons: Record<string, string> = {
    github: 'iconfont icon-github',
    twitter: 'iconfont icon-twitter',
    email: 'iconfont icon-email'
  }
  return icons[platform]
}
</script>

<style scoped>
.site-info {
  position: relative;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  text-align: center;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.1;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: var(--vp-c-brand);
  transition: all 0.5s ease;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: -60px;
  left: -60px;
  opacity: 0.3;
}

.circle-2 {
  width: 80px;
  height: 80px;
  bottom: -40px;
  right: -40px;
  opacity: 0.2;
}

.circle-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  right: -30px;
  opacity: 0.15;
}

.is-hovering .circle-1 {
  transform: scale(1.2) translate(10px, 10px);
}

.is-hovering .circle-2 {
  transform: scale(1.2) translate(-10px, -10px);
}

.is-hovering .circle-3 {
  transform: scale(1.2) translate(-10px, 0);
}

/* 头像容器 */
.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
  z-index: 1;
}

.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid var(--vp-c-bg-soft);
}

.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 3px solid var(--vp-c-brand);
  opacity: 0.5;
  transition: all 0.5s ease;
}

.avatar-container:hover .avatar {
  transform: scale(1.1) rotate(5deg);
}

.avatar-container:hover .avatar-ring {
  transform: scale(1.1);
  opacity: 1;
  border-color: var(--vp-c-brand-light);
}

/* 状态徽章 */
.status-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10B981;
  position: relative;
}

.status-dot::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: #10B981;
  opacity: 0.4;
  animation: pulse 2s ease-in-out infinite;
}

/* 信息内容 */
.info-content {
  position: relative;
  z-index: 1;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.verified-badge {
  color: var(--vp-c-brand);
  font-size: 1.2rem;
}

.description {
  min-height: 3em;
  margin: 0.75rem 0 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 社交链接 */
.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-link {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--vp-c-brand);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link i {
  position: relative;
  z-index: 1;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-5px);
  color: white;
}

.social-link:hover::before {
  opacity: 1;
}

.tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.social-link:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0.4; }
}

/* 深色模式优化 */
:root.dark .site-info {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

:root.dark .site-info:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .site-info {
    padding: 1.5rem;
  }

  .avatar-wrap {
    width: 90px;
    height: 90px;
  }

  .name {
    font-size: 1.3rem;
  }

  .social-link {
    width: 36px;
    height: 36px;
  }
}
</style> 