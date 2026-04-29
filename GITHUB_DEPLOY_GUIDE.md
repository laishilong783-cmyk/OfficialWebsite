# GitHub + GitHub Pages 部署完整指南

> 本文档记录本项目从本地代码推送到 GitHub，并配置 GitHub Actions 自动部署到 GitHub Pages 的完整步骤，以及子路径部署时的踩坑与修复方案。

---

## 一、初始化 Git 并推送到 GitHub

### 1.1 前提
- 已在 GitHub 创建空仓库（如 `https://github.com/laishilong783-cmyk/OfficialWebsite.git`）
- 本地项目目录内**没有** `.git` 仓库

### 1.2 执行命令

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/laishilong783-cmyk/OfficialWebsite.git
git push -u origin main
```

> **注意**：使用 `git add .` 添加所有文件，而不是只 `git add README.md`。
> `node_modules` 和 `dist` 等文件已通过 `.gitignore` 自动排除。

---

## 二、开启 GitHub Pages 并选择 GitHub Actions

1. 打开 GitHub 仓库页面 → **Settings** → **Pages**
2. 在 **Build and deployment** → **Source** 中，选择 **GitHub Actions**
3. 保存

> 不要选 "Deploy from a branch"，而是选 **GitHub Actions**，这样才能用自定义 workflow 自动构建 React 项目。

---

## 三、创建 GitHub Actions 部署文件

### 3.1 创建文件

在项目根目录创建：

```
.github/workflows/deploy.yml
```

### 3.2 Workflow 内容

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3.3 说明

| 步骤 | 作用 |
|------|------|
| `actions/checkout@v4` | 拉取代码 |
| `actions/setup-node@v4` | 安装 Node.js 20，并启用 npm 缓存 |
| `npm ci` | 安装依赖（比 `npm install` 更快、更稳定，适合 CI） |
| `npm run build` | Vite 构建，输出到 `dist/` |
| `actions/upload-pages-artifact@v3` | 上传构建产物 |
| `actions/deploy-pages@v4` | 将产物部署到 GitHub Pages |

---

## 四、修改 Vite 的 base 路径

### 4.1 问题
GitHub Pages 项目站点（Project Site）的 URL 包含仓库名子路径：
```
https://<username>.github.io/<repo-name>/
```
例如：
```
https://laishilong783-cmyk.github.io/OfficialWebsite/
```

如果不配置 Vite 的 `base`，构建后的 JS/CSS 引用路径会是 `/assets/...`，浏览器会到域名根目录去找，导致 404。

### 4.2 修改 `vite.config.ts`

```ts
export default defineConfig({
  base: '/OfficialWebsite/',  // 改成你的仓库名
  // ...其他配置
});
```

> 如果是**用户站点**（仓库名为 `username.github.io`），`base` 保持 `'/'` 或 `'./'` 即可。

---

## 五、修复 React Router 子路径路由（空白页问题）

### 5.1 问题现象
构建成功、Actions 变绿，但预览页面是**空白**。

### 5.2 原因
`BrowserRouter` 默认认为应用部署在域名根路径 `/`。当部署在子路径 `/OfficialWebsite/` 时，React Router 会把 `/OfficialWebsite/` 当成路由去匹配，而项目里只有 `/` 这一个路由，导致匹配失败，页面空白。

### 5.3 修复 `src/main.tsx`

给 `BrowserRouter` 添加 `basename`：

```tsx
import { BrowserRouter } from 'react-router';

<BrowserRouter basename="/OfficialWebsite">
  <App />
</BrowserRouter>
```

> `basename` 的值要与 `vite.config.ts` 中的 `base` 保持一致（注意不带末尾斜杠也可，React Router 会自动处理）。

---

## 六、修复 public 目录图片路径（图片不加载）

### 6.1 问题现象
页面能正常显示，但 `public/images/` 下的图片加载失败，显示碎图图标。

### 6.2 原因
代码中使用了绝对路径引用 public 目录下的图片：

```tsx
<img src="/images/service-enterprise.jpg" />
```

浏览器会请求：
```
https://laishilong783-cmyk.github.io/images/service-enterprise.jpg
```

但实际图片在：
```
https://laishilong783-cmyk.github.io/OfficialWebsite/images/service-enterprise.jpg
```

### 6.3 修复方案

使用 Vite 提供的 `import.meta.env.BASE_URL` 拼接路径：

```tsx
// 去掉路径开头的斜杠
const services = [
  {
    image: 'images/service-enterprise.jpg',
    // ...
  },
];

// 使用时拼接 BASE_URL
<img src={import.meta.env.BASE_URL + service.image} />
```

`import.meta.env.BASE_URL` 在开发环境下是 `/`，生产环境下自动变为 `/OfficialWebsite/`，两边都能正常工作。

---

## 七、完整修改清单汇总

| 文件 | 修改内容 |
|------|----------|
| `.github/workflows/deploy.yml` | 新增 GitHub Actions 自动构建部署 |
| `vite.config.ts` | `base` 从 `'./'` 改为 `'/OfficialWebsite/'` |
| `src/main.tsx` | `BrowserRouter` 添加 `basename="/OfficialWebsite"` |
| `src/sections/Services.tsx` | 图片路径改为 `import.meta.env.BASE_URL + service.image` |

---

## 八、查看部署状态

推送代码后，GitHub Actions 会自动触发构建：

**https://github.com/laishilong783-cmyk/OfficialWebsite/actions**

等状态变为 ✅ 绿色后，访问预览地址：

**https://laishilong783-cmyk.github.io/OfficialWebsite/**

---

## 九、常见问题

### Q1: Actions 页面提示 "Approve and run"？
首次运行 workflow 时，GitHub 可能需要手动授权。点击 **Approve and run** 即可。

### Q2: 刷新子页面（如 `/about`）出现 404？
GitHub Pages 是静态托管，不支持服务端路由。如果使用 `BrowserRouter`，刷新非首页会 404。
- 方案 A：改用 `HashRouter`（URL 带 `#`，刷新正常）
- 方案 B：在仓库根目录添加 `404.html`，里面用 JS 跳转到 `index.html`（配合 `BrowserRouter`）

### Q3: 如何更新网站内容？
直接修改代码 → `git add .` → `git commit -m "xxx"` → `git push`，Actions 会自动重新构建部署。
