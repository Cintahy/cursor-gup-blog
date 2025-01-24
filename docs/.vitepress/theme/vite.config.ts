import type { UserConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import { presetIcons } from '@unocss/preset-icons'
import type { PluginOption } from 'vite'

// 定义 UnoCSS 配置
const unoCSSConfig = {
  presets: [
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      },
      prefix: 'i-'
    })
  ],
  rules: [
    ['search-icon', { 
      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>')`
    }],
    ['close-icon', { 
      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>')`
    }]
  ]
}

// 导出 Vite 配置
export const viteConfig: UserConfig['vite'] = {
  // Vite 配置
  ssr: {
    noExternal: ['vue']
  },
  plugins: [
    UnoCSS(unoCSSConfig) as PluginOption
  ]
} 