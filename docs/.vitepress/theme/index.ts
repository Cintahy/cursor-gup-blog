// https://vitepress.dev/guide/custom-theme
import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeLayout from './components/HomeLayout.vue'
import BlogPostCard from './components/BlogPostCard.vue'
import BlogPosts from './components/BlogPosts.vue'
import BlogCategories from './components/BlogCategories.vue'
import BlogTags from './components/BlogTags.vue'
import BlogPost from './components/BlogPost.vue'
import BlogComment from './components/BlogComment.vue'
import BlogShare from './components/BlogShare.vue'
import BlogSearch from './components/BlogSearch.vue'
import BlogToc from './components/BlogToc.vue'
import BlogArchive from './components/BlogArchive.vue'
import BackToTop from './components/BackToTop.vue'
import BlogStats from './components/BlogStats.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import MobileMenu from './components/MobileMenu.vue'
import Layout from './components/Layout.vue'
import LatestPosts from './components/LatestPosts.vue'
import './styles/main.css'
import 'uno.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('HomeLayout', HomeLayout)
    app.component('BlogPostCard', BlogPostCard)
    app.component('BlogPosts', BlogPosts)
    app.component('BlogCategories', BlogCategories)
    app.component('BlogTags', BlogTags)
    app.component('BlogPost', BlogPost)
    app.component('BlogComment', BlogComment)
    app.component('BlogShare', BlogShare)
    app.component('BlogSearch', BlogSearch)
    app.component('BlogToc', BlogToc)
    app.component('BlogArchive', BlogArchive)
    app.component('BackToTop', BackToTop)
    app.component('BlogStats', BlogStats)
    app.component('ReadingProgress', ReadingProgress)
    app.component('MobileMenu', MobileMenu)
    app.component('LatestPosts', LatestPosts)
  }
} satisfies Theme
