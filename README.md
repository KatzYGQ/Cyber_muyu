# 赛博木鱼 · Cyber Muyu

极简黑金风格的单页木鱼应用：点击木鱼增加功德，全球累计功德同步到数据库。

## 技术栈

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Supabase**（insforge 后端）存储 `cyber_muyu` 表
- **Lucide React** 图标
- **Web Audio API** 合成木鱼敲击音效

## 本地运行

1. 复制环境变量并填写 Supabase 信息：

   ```bash
   cp .env.example .env.local
   ```

   在 `.env.local` 中设置：

   - `NEXT_PUBLIC_SUPABASE_URL`：insforge/Supabase 项目 URL
   - `SUPABASE_SERVICE_ROLE_KEY`：服务端密钥（用于 API 路由读写 `cyber_muyu`）

2. 安装依赖并启动：

   ```bash
   npm install
   npm run dev
   ```

3. 打开 [http://localhost:3000](http://localhost:3000)。

## 功能说明

- **顶部**：显示「全球累计功德：XXX」，从 `cyber_muyu` 表 `id=1` 的 `total_clicks` 读取。
- **中央木鱼**：大圆形金色木鱼图标，点击有轻微缩放动画。
- **功德 +1**：每次点击向上飘出淡出的金色「功德 +1」文字。
- **音效**：使用 Web Audio 合成短促敲击声（正弦波 880→440 Hz，快速衰减）。
- **数据**：每次点击调用 `POST /api/click`，更新数据库 `total_clicks` 与 `last_click_at`，并刷新顶部数字。

## 项目结构

- `src/app/page.tsx`：主页面（木鱼 UI、动画、音效、请求）
- `src/app/api/stats/route.ts`：`GET` 获取当前 `total_clicks`
- `src/app/api/click/route.ts`：`POST` 增加一次点击并返回新 `total_clicks`
- `src/lib/supabase.ts`：Supabase 服务端客户端
