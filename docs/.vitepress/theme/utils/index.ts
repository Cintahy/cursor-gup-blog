// 计算阅读时间
export function calculateReadingTime(content: string): number {
  if (!content) return 0
  
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '')
  
  // 计算中文字符数
  const cnCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  
  // 计算英文单词数
  const enWordCount = (text.match(/[a-zA-Z]+/g) || []).length
  
  // 假设中文阅读速度为每分钟 300 字
  // 英文阅读速度为每分钟 200 词
  const readingTime = Math.ceil(cnCharCount / 300 + enWordCount / 200)
  
  return Math.max(1, readingTime) // 最少 1 分钟
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
} 