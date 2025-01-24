import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Post } from '../types'

// 获取所有文章数据
export function getPosts(postsDir: string): Post[] {
  if (!fs.existsSync(postsDir)) {
    return []
  }

  const posts: Post[] = []
  
  // 递归扫描目录
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        scanDir(filePath)
      } else if (
        file.endsWith('.md') && 
        !['index.md', 'README.md'].includes(file) &&
        !file.startsWith('_')
      ) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          const { data: frontmatter, excerpt } = matter(content, {
            excerpt: true,
            excerpt_separator: '<!-- more -->'
          })

          if (!frontmatter.title) {
            console.warn(`Warning: Missing title in ${filePath}`)
            return
          }

          const relativePath = path.relative(postsDir, filePath)
          
          posts.push({
            path: `/posts/${relativePath.replace(/\.md$/, '')}`,
            title: frontmatter.title,
            date: frontmatter.date ? 
              new Date(frontmatter.date).toISOString().split('T')[0] : 
              stat.birthtime.toISOString().split('T')[0],
            excerpt: frontmatter.excerpt || excerpt || '',
            cover: frontmatter.cover || '',
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
              typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [],
            author: frontmatter.author || 'Anonymous',
            category: frontmatter.category || 'uncategorized',
            wordCount: content.replace(/\s/g, '').length,
            readingTime: Math.ceil(content.replace(/\s/g, '').length / 400),
            draft: frontmatter.draft || false
          })
        } catch (e) {
          console.error(`Error processing ${filePath}:`, e)
        }
      }
    })
  }

  scanDir(postsDir)
  
  return posts
    .filter(post => process.env.NODE_ENV === 'development' || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 工具函数：格式化日期
export function formatDate(date: string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
} 