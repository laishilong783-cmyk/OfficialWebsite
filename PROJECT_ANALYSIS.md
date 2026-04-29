# InsightBit（拓知微科技）官网 — 项目需求与代码逻辑分析

> 本文档基于对项目源码的全面阅读与整理，涵盖项目定位、技术架构、页面结构、各模块功能逻辑及设计系统。

---

## 一、项目概述

| 项目 | 说明 |
|------|------|
| **名称** | InsightBit（拓知微科技） |
| **定位** | 软件定制开发公司的品牌官网 / 落地页 |
| **语言** | 中文为主，部分英文装饰性文案 |
| **页面数** | 单页（Single Page），通过锚点滚动切换区块 |

### 1.1 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建工具 | Vite 7.2.4 |
| 样式 | Tailwind CSS v3.4.19 |
| UI 组件库 | shadcn/ui（基于 Radix UI，40+ 组件） |
| 3D 渲染 | React Three Fiber + Three.js |
| 路由 | react-router（BrowserRouter） |
| 图标 | lucide-react |
| 字体 | Noto Sans SC、JetBrains Mono |

### 1.2 项目目录结构

```
src/
├── main.tsx              # 应用入口（ReactDOM + BrowserRouter + StrictMode）
├── App.tsx               # 根路由（仅一个 / 路由指向 Home）
├── index.css             # 全局样式、CSS 变量、自定义工具类
├── App.css               # 默认 Vite 模板样式（当前几乎未使用）
├── pages/
│   └── Home.tsx          # 首页：整合所有区块 + SplashScreen 状态管理
├── sections/             # 页面各区块组件
│   ├── Hero.tsx          # 首屏英雄区
│   ├── Keywords.tsx      # 关键词标签云
│   ├── Services.tsx      # 核心服务列表
│   ├── TechStack.tsx     # 技术栈展示
│   ├── DataStats.tsx     # 数据统计数字滚动
│   ├── Contact.tsx       # 联系信息 + 页脚
│   └── Marquee.tsx       # 无限滚动横幅（已定义但未在首页引用）
├── components/
│   ├── Navbar.tsx        # 顶部固定导航
│   ├── SplashScreen.tsx  # 全屏开场动画
│   ├── CustomCursor.tsx  # 自定义鼠标光标（已定义但未引用）
│   ├── HeroCanvas.tsx    # 浅色模式 3D 晶体背景（Three.js）
│   ├── StarfieldCanvas.tsx # 深色模式星空背景（Three.js + 着色器）
│   └── ui/               # shadcn/ui 组件库（40+ 组件）
├── hooks/
│   ├── useTheme.tsx      # 主题管理 Context（light / dark）
│   └── use-mobile.ts     # 响应式检测 Hook（768px 断点）
└── lib/
    └── utils.ts          # cn() 工具函数（clsx + tailwind-merge）
```

---

## 二、核心功能需求分析

### 2.1 开场动画（SplashScreen）

**需求目标**：营造科技感第一印象，以"扫描/洞察"为概念，引导用户点击进入主站。

**四阶段状态机**：

| 阶段 | 名称 | 时长 | 行为 |
|------|------|------|------|
| `entering` | 入场 | 600ms | 文字从下方淡入浮现 |
| `scanning` | 扫描 | 2400ms | 放大镜从左到右水平扫描，底部进度条同步更新 |
| `ready` | 就绪 | 无限 | 放大镜跟随鼠标/触摸水平移动；提示用户"移动放大镜探索 / 点击开始" |
| `fading` | 淡出 | 1800ms | 整体透明度降为0，内容区同步淡入，完成后通知父组件移除 SplashScreen |

**关键实现细节**：
- 扫描阶段用 `requestAnimationFrame` + `state` 驱动放大镜位置，保证 React 重渲染。
- ready 阶段改用 `ref` + `RAF` 循环直接操作 DOM，避免每帧触发 React 重渲染。
- 使用 `lerp`（线性插值）实现放大镜平滑跟随。
- 放大镜内部文字反向位移 + 放大（`scale(1.5)`），制造真实放大效果。
- 深色模式有随机生成的星空背景；浅色模式有微网格背景。

### 2.2 主题系统（Light / Dark）

**需求目标**：支持用户手动切换明暗主题，并记住偏好设置。

**逻辑**：
- 通过 `ThemeContext` 全局管理。
- 初始化时：先读 `localStorage('insightbit-theme')`，不存在则跟随系统 `prefers-color-scheme`。
- 切换时：修改 `document.documentElement` 的 `dark` 类名，Tailwind `darkMode: "class"` 生效。
- 所有区块组件均通过 `useTheme()` 获取当前主题，动态切换颜色。

### 2.3 首屏 Hero 区域

**需求目标**：展示公司品牌主张，配合沉浸式 3D 背景，吸引用户继续浏览。

**内容**：
- Badge："软件定制开发专家"（带脉冲黄点）
- 主标题："以代码，\n重构万物"
- 副标题：公司简介
- 两个 CTA："探索解决方案"（滚动到服务）、"技术能力"（滚动到技术栈）
- 底部数据预览：150+ / 99.9% / 10年
- 右下角滚动指示器（仅桌面端）

**3D 背景切换逻辑**：
- **浅色模式**：`HeroCanvas` —— 漂浮的透明晶体（IcosahedronGeometry），带线框边框。晶体缓慢自转 + 上下浮动，鼠标悬停时放大、变亮、发光。周围有 60 个浮动粒子。
- **深色模式**：`StarfieldCanvas` —— 2500 颗星星（自定义 GLSL 着色器实现闪烁），银河粒子带，星云平面，以及稀缺的 CSS 流星动画（60~90 秒间隔）。
- Canvas 组件使用 `React.lazy` 懒加载，延迟 300ms 显示，带 fallback 模糊圆形。

### 2.4 核心服务（Services）

**需求目标**：清晰展示公司五大服务能力，采用交互式列表增强体验。

**内容**：
1. 企业级软件开发（Enterprise Software）
2. 移动应用开发（Mobile App Development）
3. 云原生架构（Cloud Architecture）
4. AI 智能集成（AI Integration）
5. UI/UX 设计（UI/UX Design）

**交互设计**：
- 桌面端采用 **左 sticky 标题 + 右服务列表** 的 12 栏网格布局。
- 每项服务默认仅显示编号、图标、标题、英文标题。
- **鼠标悬停** 时展开详情区域（`max-height` 动画），显示描述文字 + 右侧服务缩略图。
- 悬停时图标背景变色、标题变色、箭头浮现。
- 图片使用 `loading="lazy"` 懒加载。

### 2.5 技术栈（TechStack）

**需求目标**：展示技术实力，用卡片网格呈现技术生态。

**内容**：React、Vue、Node.js、Python、Go、Kubernetes、AWS、Flutter、PostgreSQL（共 9 项）。

**交互设计**：
- 2/3 列响应式网格。
- 卡片悬停时：整体上浮、背景出现超大首字母水印、标题变黄色、右上角出现黄色圆点角标。
- IntersectionObserver 触发入场动画（stagger 80ms）。

### 2.6 数据统计（DataStats）

**需求目标**：用动态数字增强可信度。

**内容**：150+ 成功案例、99.9% 系统稳定性、24/7 技术支持、10年行业深耕。

**关键实现 —— `RollingNumber` 组件**：
- 使用 `requestAnimationFrame` 实现数字从 0 滚动到目标值。
- 缓动函数：`easeOutExpo`（`1 - 2^(-10x)`），先快后慢，视觉冲击力更强。
- 持续时间 2000ms。
- IntersectionObserver 触发（threshold: 0.3），进入视口才开始计数。
- 数字使用 `JetBrains Mono` 等宽字体，后缀黄色高亮。

### 2.7 联系与页脚（Contact）

**需求目标**：提供明确的联系方式，建立信任。

**内容**：
- 大标题 "LET'S TALK."
- 邮箱链接：`hello@insightbit.tech`（带下划线动画）
- 联系卡片：总部地址、商务咨询电话、合作邮箱
- 页脚：Logo + 导航链接 + GitHub/LinkedIn 社交图标 + 版权信息

### 2.8 导航栏（Navbar）

**需求目标**：全局导航，支持快速跳转到各锚点区块。

**行为**：
- 固定在顶部，`z-50`。
- 滚动超过 60px 后背景变为毛玻璃（`backdrop-filter: blur`）。
- 5 个锚点链接：首页、服务、技术栈、数据、联系。
- 主题切换按钮（太阳/月亮图标）。
- "立即咨询" CTA 按钮。
- 移动端：汉堡菜单，展开/收起带 `max-height` 动画。

---

## 三、设计系统（Design System）

### 3.1 色彩

| 名称 | 色值 | 用途 |
|------|------|------|
| **insight-blue** | `#0A2463` | 主品牌色，标题、按钮、边框 |
| **insight-yellow** | `#E5B80B` | 强调色，高亮、角标、统计后缀 |
| **insight-gray** | `#E5E7EB` | 浅色边框、分割线 |
| **insight-light** | `#F8F9FA` | 浅色区块背景 |
| 深色背景 | `#080f1e` | 深色模式主背景 |
| 深色卡片 | `#0f1f38` | 深色模式卡片背景 |

### 3.2 自定义 CSS 工具类

| 类名 | 作用 |
|------|------|
| `.glass-nav` | 毛玻璃导航背景（白/深蓝半透明 + blur 20px） |
| `.section-padding` | 响应式水平内边距（`px-6` → `2xl:px-32`） |
| `.hover-lift` | 悬停上浮 8px + 阴影 |
| `.btn-primary` | 主按钮：蓝底黄字、圆角全满、阴影、点击缩放 |
| `.btn-outline` | 描边按钮：蓝边框、悬停反色填充 |
| `.link-underline` | 下划线从左到右展开动画 |
| `.card-tech` | 技术栈卡片样式 + 悬停边框/阴影变化 |

### 3.3 动画关键帧

| 名称 | 效果 |
|------|------|
| `marquee` | 无限横向滚动（30s 线性循环） |
| `slide-up` | 从下方 20px 淡入上浮 |
| `float` | 上下漂浮（6s 循环） |
| `pulse-glow` | 脉冲发光阴影 |

---

## 四、关键代码逻辑总结

### 4.1 入场流程时序

```
用户访问
  └── SplashScreen（全屏遮罩，z-100）
       ├── entering（600ms）文字浮现
       ├── scanning（2400ms）放大镜扫描
       ├── ready（等待用户交互）放大镜跟随鼠标
       └── 用户点击 → fading（1800ms）SplashScreen 淡出
            └── 同时 Home 内容区 opacity 0→1, translateY 30px→0, blur 2px→0
  └── Navbar + main 各 section（预渲染在底层，pointer-events 初始禁用）
```

### 4.2 可见性动画通用模式

几乎所有区块（Keywords、Services、TechStack、DataStats、Contact）都使用了相同的可见性动画模式：

```tsx
const [isVisible, setIsVisible] = useState(false);
const sectionRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target); // 只触发一次
      }
    },
    { threshold: 0.1~0.3 }
  );
  observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
```

配合 Tailwind 类实现：
```
isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6/8'
```
并带有递增的 `transitionDelay` 实现 stagger 效果。

### 4.3 3D 背景性能优化

- `HeroCanvas` 和 `StarfieldCanvas` 均使用 `React.lazy` + `Suspense` 懒加载。
- `dpr`（设备像素比）限制在 `[1, 2]` 或 `[1, 1.5]`，避免高分辨率屏幕过度消耗 GPU。
- `useMemo` 缓存几何体和材质，避免重复创建。
- Starfield 使用自定义 GLSL 着色器在 GPU 端计算闪烁，而非每帧修改 JavaScript 状态。

### 4.4 未引用组件说明

以下组件已存在于代码库中，但当前 `Home.tsx` 未 import 使用：

| 组件 | 路径 | 说明 |
|------|------|------|
| `Marquee` | `src/sections/Marquee.tsx` | 蓝色背景无限滚动关键词横幅 |
| `CustomCursor` | `src/components/CustomCursor.tsx` | 桌面端自定义环形光标，悬停交互元素时放大发光 |

---

## 五、部署与构建配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `base` | `'./'` | 相对路径，适合静态部署到任意目录 |
| `server.port` | `3000` | 开发服务器端口 |
| `resolve.alias` | `@` → `./src` | 路径别名 |
| `plugins` | `inspectAttr` + `react` | 包含 kimi-plugin-inspect-react |

---

## 六、潜在优化点

1. **图片资源**：`/images/service-*.jpg` 为本地引用，需确保 `public/images/` 目录存在对应文件。
2. **未使用组件**：`Marquee` 和 `CustomCursor` 如需使用，需在 `Home.tsx` 中导入并放置到合适位置。
3. **路由扩展**：当前仅单页，如需增加博客/案例详情页等，可在 `App.tsx` 中扩展 `Routes`。
4. **SEO**：当前为客户端渲染，如需 SEO 可考虑添加 `react-helmet-async` 管理页面元信息。
5. **性能**：shadcn/ui 组件库完整引入，构建时 Tree Shaking 会剔除未使用的组件，无需担心包体积。
