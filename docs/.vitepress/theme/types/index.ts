export interface Post {
  path: string
  title: string
  date: string
  excerpt: string
  cover: string
  tags: string[]
  author: string
  category: string
  wordCount: number
  readingTime: number
  draft?: boolean
}

export interface BlogConfig {
  categories: Record<string, string>
  profile: {
    name: string
    avatar: string
    description: string[]
    social: {
      github: string
      twitter: string
      email: string
    }
  }
  comment: {
    repo: string
    repoId: string
    category: string
    categoryId: string
  }
}

// 扩展 DefaultTheme
declare module 'vitepress' {
  interface DefaultTheme {
    posts: Post[]
    categories: BlogConfig['categories']
    profile: BlogConfig['profile']
    comment: BlogConfig['comment']
  }
} 