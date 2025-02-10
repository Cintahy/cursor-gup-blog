<template>
  <div class="blog-stats" :class="{ 'is-hovering': isHovering }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 欢迎语和时钟部分 -->
    <div class="hello-section">
      <div class="greeting-text">
        <span class="greeting">{{ greeting }}</span>
        <span class="message">今天也要加油哦！</span>
      </div>
      <div class="clock-container">
        <div class="clock" :class="{ 'is-dark': isDark }">
          <div class="clock-face">
            <div class="hand hour" :style="{ transform: `rotate(${hourDeg}deg)` }"></div>
            <div class="hand minute" :style="{ transform: `rotate(${minuteDeg}deg)` }"></div>
            <div class="hand second" :style="{ transform: `rotate(${secondDeg}deg)` }"></div>
            <div class="center-dot"></div>
          </div>
          <div class="time-text">{{ timeText }}</div>
        </div>
      </div>
    </div>

    <!-- 站点统计 -->
    <div class="site-stats">
      <div class="stat-item">
        <div class="stat-value">{{ totalPosts }}</div>
        <div class="stat-label">文章数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalCategories }}</div>
        <div class="stat-label">分类数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalTags }}</div>
        <div class="stat-label">标签数</div>
      </div>
    </div>

    <!-- 时间进度 -->
    <div class="time-progress">
      <div 
        v-for="item in progressItems" 
        :key="item.name"
        class="progress-item"
      >
        <div class="progress-header">
          <span class="progress-name">{{ item.name }}</span>
          <span class="progress-remaining">
            还剩 {{ item.remaining.value }} {{ item.remaining.unit }}
          </span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ 
              width: `${item.percentage}%`,
              background: getProgressColor(item.percentage)
            }"
          >
            <span class="progress-value">{{ item.percentage.toFixed(1) }}%</span>
          </div>
          <span 
            class="progress-value-bg"
            :class="{ 'align-left': item.percentage < 30 }"
          >
            {{ item.percentage.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 节日倒计时 -->
    <div class="festival-countdown">
      <div class="festival-info">
        <div class="festival-name">{{ nextFestival.name }}</div>
        <div class="festival-date">{{ nextFestival.date }}</div>
      </div>
      <div class="countdown-number">
        <span class="number">{{ nextFestival.days }}</span>
        <span class="unit">天</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { isDark, theme } = useData()

const isHovering = ref(false)

// 问候语逻辑
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙 凌晨好'
  if (hour < 9) return '🌅 早上好'
  if (hour < 12) return '🌞 上午好'
  if (hour < 14) return '🌞 中午好'
  if (hour < 17) return '🌞 下午好'
  if (hour < 19) return '🌅 傍晚好'
  return '🌙 晚上好'
})

// 时钟逻辑
const hourDeg = ref(0)
const minuteDeg = ref(0)
const secondDeg = ref(0)
const timeText = ref('')

let clockTimer: NodeJS.Timer

function updateClock() {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  
  hourDeg.value = (hour % 12 + minute / 60) * 30
  minuteDeg.value = (minute + second / 60) * 6
  secondDeg.value = second * 6
  
  timeText.value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// 进度条颜色
function getProgressColor(percentage: number) {
  if (percentage < 30) return 'var(--vp-c-green)'
  if (percentage < 70) return 'var(--vp-c-brand)'
  return 'var(--vp-c-red)'
}

// 站点统计
const totalPosts = computed(() => theme.value.posts?.length || 0)
const totalCategories = computed(() => Object.keys(theme.value.categories || {}).length)
const totalTags = computed(() => {
  const tags = new Set()
  theme.value.posts?.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return tags.size
})

// 时间进度计算
const progressItems = computed(() => {
  const now = new Date()
  
  // 今日进度
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayProgress = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / (24 * 3600)) * 100
  
  // 本周进度 (周一为起点)
  const currentDay = now.getDay() || 7 // 将周日的0转换为7
  const weekProgress = ((currentDay - 1) * 24 * 3600 + now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / (7 * 24 * 3600) * 100
  
  // 本月进度
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthProgress = ((now.getDate() - 1) * 24 * 3600 + now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / (daysInMonth * 24 * 3600) * 100
  
  // 本年进度
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const daysInYear = new Date(now.getFullYear(), 11, 31).getDate() === 31 ? 365 : 366
  const yearProgress = (((now.getTime() - startOfYear.getTime()) / (daysInYear * 24 * 3600 * 1000))) * 100

  return [
    {
      name: '今日',
      percentage: dayProgress,
      remaining: {
        value: 24 - now.getHours(),
        unit: '小时'
      }
    },
    {
      name: '本周',
      percentage: weekProgress,
      remaining: {
        value: 7 - currentDay + 1,
        unit: '天'
      }
    },
    {
      name: '本月',
      percentage: monthProgress,
      remaining: {
        value: daysInMonth - now.getDate(),
        unit: '天'
      }
    },
    {
      name: '本年',
      percentage: yearProgress,
      remaining: {
        value: daysInYear - Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 3600 * 1000)),
        unit: '天'
      }
    }
  ]
})

// 节日倒计时
const nextFestival = computed(() => {
  const festivals = [
    { name: '春节', date: '2025-01-29' },
    { name: '元宵节', date: '2025-02-12' },
    { name: '清明节', date: '2025-04-04' },
    { name: '端午节', date: '2025-06-01' },
    { name: '中秋节', date: '2024-09-17' },
    { name: '国庆节', date: '2024-10-01' }
  ]
  
  const now = new Date()
  const upcoming = festivals
    .map(f => ({ 
      ...f, 
      time: new Date(f.date).getTime(),
      days: Math.ceil((new Date(f.date).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    }))
    .filter(f => f.days > 0)
    .sort((a, b) => a.time - b.time)[0]

  return upcoming || festivals[0]
})

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
.blog-stats {
  position: relative;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-stats:hover {
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

/* 确保其他内容在装饰层之上 */
.hello-section,
.site-stats,
.time-progress,
.festival-countdown {
  position: relative;
  z-index: 1;
}

/* 欢迎语部分 */
.hello-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.greeting-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.greeting {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.message {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 时钟样式 */
.clock-container {
  width: 100px;
  height: 100px;
}

.clock {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand);
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.clock-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: 50% 100%;
  background: var(--vp-c-text-1);
}

.hour {
  width: 2px;
  height: 25%;
  margin-left: -1px;
}

.minute {
  width: 2px;
  height: 35%;
  margin-left: -1px;
}

.second {
  width: 1px;
  height: 40%;
  margin-left: -0.5px;
  background: var(--vp-c-brand);
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  background: var(--vp-c-brand);
  border-radius: 50%;
}

.time-text {
  position: absolute;
  bottom: -24px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* 站点统计 */
.site-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--vp-c-bg-mute);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 时间进度 */
.time-progress {
  margin-bottom: 2rem;
}

.progress-item {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.progress-remaining {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.progress-bar {
  height: 24px;
  background: var(--vp-c-bg-mute);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
}

.progress-value {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-value-bg {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.progress-value-bg.align-left {
  right: auto;
  left: 8px;
}

.progress-fill:hover {
  filter: brightness(1.1);
}

.progress-fill:hover .progress-value {
  opacity: 1;
}

.progress-fill:hover + .progress-value-bg {
  opacity: 0;
}

/* 节日倒计时 */
.festival-countdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--vp-c-bg-mute);
  border-radius: 12px;
}

.festival-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.festival-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.countdown-number {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand);
}

.unit {
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

/* 深色模式优化 */
:root.dark .blog-stats {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

:root.dark .blog-stats:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

:root.dark .clock {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

:root.dark .progress-bar {
  background: rgba(255, 255, 255, 0.05);
}

:root.dark .progress-value-bg {
  color: var(--vp-c-text-3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-stats {
    padding: 1rem;
  }

  .hello-section {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .site-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .progress-bar {
    height: 20px;
  }

  .progress-value,
  .progress-value-bg {
    font-size: 0.8rem;
  }
}
</style>