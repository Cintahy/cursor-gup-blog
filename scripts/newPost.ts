import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import dayjs from 'dayjs'
import * as pinyin from 'pinyin'
import { execSync } from 'child_process'

interface PostConfig {
  title: string
  excerpt: string
  category: string
  tags: string[]
  draft: boolean
  date: string
  slug: string
  fileName: string
}

// 配置项
const CONFIG = {
  categories: ['tech', 'life', 'growth'],
  defaultCover: '/public/images/developer.png',
  defaultAuthor: 'Gup.H',
  postsDir: 'docs/posts',
  dateFormat: 'YYYY-MM-DD',
  templates: {
    tech: `
## 背景

介绍问题背景和解决思路...

## 实现方案

详细的技术实现过程...

## 核心代码

\`\`\`typescript
// 示例代码
\`\`\`

## 总结

经验总结和最佳实践...
    `,
    life: `
## 前言

分享生活感悟...

## 正文

记录生活点滴...

## 总结

生活感悟与思考...
    `,
    growth: `
## 学习目标

设定明确的学习目标...

## 学习过程

记录学习历程...

## 学习心得

总结学习收获...
    `
  }
} as const

// 刷新文章列表
async function refreshPosts() {
  try {
    console.log('\n🔄 正在刷新文章列表...')
    
    // 使用 vitepress 的 dev 命令刷新
    execSync('pnpm run docs:dev', {
      stdio: 'inherit',
      timeout: 5000 // 5秒超时
    })
    
    console.log('✅ 文章列表刷新成功！')
  } catch (error) {
    console.warn('\n⚠️ 文章列表刷新失败，请手动运行 pnpm run docs:dev')
  }
}

// 创建文章的主函数
async function createPost() {
  try {
    // 获取用户输入
    const response = await promptPostInfo()
    if (!response) return

    // 生成文件路径
    const { filePath, fileName } = generateFilePath(response)
    
    // 创建文章
    await writePostFile(filePath, response)

    console.log('\n✨ 文章创建成功！')
    console.log('📝 文件路径：', filePath)
    console.log('🔗 访问链接：', `/posts/${response.category}/${response.slug}`)
    console.log('\n提示：')
    console.log('1. 请及时更新文章内容')
    console.log('2. 完成后记得去掉 draft 标记')
    console.log('3. 图片请放在 public/images 目录下')

    // 询问是否刷新文章列表
    const { shouldRefresh } = await prompts({
      type: 'confirm',
      name: 'shouldRefresh',
      message: '是否立即刷新文章列表？',
      initial: true
    })

    if (shouldRefresh) {
      await refreshPosts()
    } else {
      console.log('\n💡 提示：稍后需要运行 pnpm run docs:dev 以刷新文章列表')
    }

  } catch (error) {
    console.error('\n❌ 创建文章失败：', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// 获取用户输入
async function promptPostInfo(): Promise<PostConfig | null> {
  const onCancel = () => {
    console.log('\n❌ 操作已取消')
    process.exit(0)
  }

  const date = dayjs().format(CONFIG.dateFormat)

  const response = await prompts([
    {
      type: 'text',
      name: 'title',
      message: '请输入文章标题',
      validate: value => value.trim().length > 0 ? true : '标题不能为空'
    },
    {
      type: 'text',
      name: 'excerpt',
      message: '请输入文章摘要',
      validate: value => value.trim().length > 0 ? true : '摘要不能为空'
    },
    {
      type: 'select',
      name: 'category',
      message: '请选择文章分类',
      choices: CONFIG.categories.map(c => ({ title: c, value: c }))
    },
    {
      type: 'text',
      name: 'tags',
      message: '请输入文章标签（用逗号分隔）',
      validate: value => value.trim().length > 0 ? true : '至少需要一个标签',
      format: value => value.split(',').map(t => t.trim()).filter(Boolean)
    },
    {
      type: 'confirm',
      name: 'draft',
      message: '是否为草稿？',
      initial: true
    }
  ], { onCancel })

  const slug = pinyin.default(response.title, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  })
    .flat()
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const config = {
    ...response,
    date,
    slug
  }

  return {
    ...config,
    fileName: generateFileName(config)
  } as PostConfig
}

// 生成文件名
function generateFileName(config: Omit<PostConfig, 'fileName'>): string {
  const dateStr = config.date.replace(/-/g, '')
  const serialNumber = getNextSerialNumber(config.category, dateStr)
  
  return `${config.category}-${dateStr}-${serialNumber}.md`
}

// 获取下一个序号
function getNextSerialNumber(category: string, dateStr: string): string {
  const categoryDir = path.join(process.cwd(), CONFIG.postsDir, category)
  if (!fs.existsSync(categoryDir)) {
    return '001'
  }

  const files = fs.readdirSync(categoryDir)
  const todayFiles = files.filter(file => file.includes(dateStr))
  const numbers = todayFiles
    .map(file => {
      const match = file.match(/^[a-z]+-\d{8}-(\d{3})\.md$/)
      return match ? parseInt(match[1]) : 0
    })
    .filter(n => !isNaN(n))

  const maxNumber = Math.max(0, ...numbers)
  return String(maxNumber + 1).padStart(3, '0')
}

// 生成文件路径
function generateFilePath(config: PostConfig) {
  const categoryDir = path.join(process.cwd(), CONFIG.postsDir, config.category)
  const filePath = path.join(categoryDir, config.fileName)

  // 确保目录存在
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }

  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    throw new Error(`文件已存在：${filePath}`)
  }

  return { filePath, fileName: config.fileName }
}

// 写入文件
async function writePostFile(filePath: string, config: PostConfig) {
  // 格式化标签：使用单引号，并确保每个标签都被单引号包裹
  const formattedTags = config.tags
    .map(tag => `'${tag.replace(/'/g, "\\'")}'`)
    .join(', ')
  
  // 获取对应分类的模板
  const template = CONFIG.templates[config.category as keyof typeof CONFIG.templates] || ''
  
  const content = `---
title: ${config.title}
date: ${config.date}
excerpt: ${config.excerpt}
cover: ${CONFIG.defaultCover}
tags: [${formattedTags}]
author: ${CONFIG.defaultAuthor}
category: ${config.category}${config.draft ? '\ndraft: true' : ''}
---

${config.title}

<!-- more -->${template}`

  await fs.promises.writeFile(filePath, content, 'utf-8')
}

// 运行脚本
createPost() 