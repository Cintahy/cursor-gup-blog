import { defineConfig } from 'vitepress'
import { getPosts } from './theme/utils/posts'
import path from 'path'
import matter from 'gray-matter'
import { viteConfig } from './theme/vite.config'

// 博客配置
const blogConfig = {
  categories: {
    tech: '技术',
    life: '生活',
    growth: '成长'
  },
  profile: {
    name: 'Gup.H',
    avatar: '/public/logo.png',
    description: [
      'Java开发工程师',
      '热爱技术，热爱生活',
      '记录学习，分享成长'
    ],
    social: {
      github: 'https://github.com/yourusername',
      twitter: 'https://twitter.com/yourusername',
      email: 'mailto:your@email.com'
    }
  },
  comment: {
    repo: 'your-username/your-repo-name',
    repoId: 'your-repo-id',
    category: 'Announcements',
    categoryId: 'your-category-id'
  }
} as const

// 获取文章数据
const posts = getPosts(path.resolve(__dirname, '../posts'))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Gup.H',
  description: 'Gup.H 的个人博客',
  
  themeConfig: {
    siteTitle: 'Gup.H',
    
    // 导航菜单
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '归档', link: '/archive/' },
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '关于', link: '/about/' }
    ],

    socialLinks: [
      { icon: 'github', link: blogConfig.profile.social.github },
      { icon: 'twitter', link: blogConfig.profile.social.twitter }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present'
    },

    // 博客配置
    posts,
    categories: blogConfig.categories,
    profile: blogConfig.profile,
    comment: blogConfig.comment
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // 可以使用 markdown-it 插件
    }
  },

  // 使用 Vite 配置
  vite: viteConfig
})
