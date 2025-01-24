<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a 
          v-for="link in socialLinks"
          :key="link.link"
          :href="link.link"
          class="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <component :is="link.icon" class="icon" />
        </a>
      </div>
      <p class="copyright">
        © {{ currentYear }} {{ siteTitle }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()

const siteTitle = computed(() => theme.value.siteTitle || '我的博客')
const socialLinks = computed(() => theme.value.socialLinks || [])
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  padding: 32px 24px;
  background-color: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color 0.5s, background-color 0.5s;
}

.footer-content {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
  border-radius: 8px;
}

.social-link:hover {
  color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-dimm);
}

.icon {
  width: 20px;
  height: 20px;
}

.copyright {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 24px 16px;
  }
}
</style> 