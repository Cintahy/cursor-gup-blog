# Cursor Gup Blog

基于 VitePress 的个人博客系统，支持文章管理、分类、标签、评论等功能。

## 特性

- 📝 Markdown 写作支持
- 🏷️ 文章分类与标签管理
- 🔍 全文搜索功能
- 💬 Giscus 评论系统
- 📊 阅读统计
- 🌓 深色模式支持
- 📱 响应式设计
- ⚡️ 快速的页面加载
- 🖼️ 图片预览
- ⌨️ 打字机效果
- ⚙️ 可配置的主题

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run docs:dev
```

### 构建

```bash
pnpm run docs:build
```

### 预览构建结果

```bash
pnpm run docs:preview
```

### 创建新文章

```bash
pnpm run new
```

## 目录结构

```
.
├── docs/
│   ├── .vitepress/          # VitePress 配置
│   │   ├── config.mts       # 站点配置
│   │   └── theme/           # 主题相关
│   ├── posts/              # 文章目录
│   │   ├── tech/           # 技术文章
│   │   ├── life/           # 生活随笔
│   │   └── growth/         # 成长感悟
│   └── public/             # 静态资源
├── scripts/                # 脚本工具
└── package.json
```

## 主要功能

1. 文章管理
   - 支持分类和标签
   - 文章封面图
   - 阅读时间估算
   - 文章目录
   - 阅读进度条

2. 交互体验
   - 响应式设计
   - 图片预览
   - 返回顶部
   - 文章分享
   - 评论系统

3. 开发体验
   - TypeScript 支持
   - 文章创建脚本
   - 自动生成目录
   - 开发热重载

## 配置说明

主要配置文件位于 `docs/.vitepress/config.mts`，包括：

- 站点信息
- 导航菜单
- 主题配置
- 博客配置
- Markdown 配置

## 自定义主题

主题相关文件位于 `docs/.vitepress/theme/` 目录下：

- `index.ts`: 主题入口
- `Layout.vue`: 布局组件
- `styles/`: 样式文件
- `components/`: 组件目录

## 部署

1. 构建站点：
```bash
pnpm run docs:build
```

2. 将 `docs/.vitepress/dist` 目录部署到你的服务器

## 贡献

欢迎提交 Issue 和 Pull Request

## 许可证

MIT License

## 作者

Gup.H