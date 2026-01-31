# 赛博木鱼 — 部署到网上（Vercel）

按下面步骤做，大约 5 分钟可以得到一个可分享的网址。

---

## 第一步：把项目推到 GitHub

1. 打开 **https://github.com**，登录后点右上角 **+** → **New repository**。
2. 仓库名随便起（例如 `cyber-muyu`），选 **Public**，点 **Create repository**。
3. 在**本机项目文件夹**里打开终端（Cursor 里按 **Ctrl + `**），执行：

   ```bash
   cd c:\Users\lol19\QC_MATH_172_Spring_2025\hw02\b5
   git init
   git add .
   git commit -m "cyber muyu"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

   把 `你的用户名` 和 `你的仓库名` 换成你刚建的仓库。  
   如果提示要登录 GitHub，按提示在浏览器里授权或使用 Personal Access Token。

**注意：** 项目里的 `.gitignore` 已经排除了 `.env.local`，所以密钥不会被推上去。

---

## 第二步：用 Vercel 部署

1. 打开 **https://vercel.com**，用 **GitHub 账号登录**（Sign up with GitHub）。
2. 登录后点 **Add New…** → **Project**。
3. 在列表里找到你刚推上去的仓库（例如 `cyber-muyu`），点 **Import**。
4. **不要急着点 Deploy**，先配置环境变量：
   - 在页面里找到 **Environment Variables**（环境变量）。
   - 添加两条：
     - **Name:** `NEXT_PUBLIC_SUPABASE_URL`  
       **Value:** 把你 `.env.local` 里 `NEXT_PUBLIC_SUPABASE_URL=` 后面的内容粘贴进去。
     - **Name:** `SUPABASE_SERVICE_ROLE_KEY`  
       **Value:** 把你 `.env.local` 里 `SUPABASE_SERVICE_ROLE_KEY=` 后面的内容粘贴进去。
5. 点 **Deploy**，等一两分钟。
6. 部署完成后会显示 **Visit** 或一个网址（例如 `https://cyber-muyu-xxx.vercel.app`），点进去就是你的木鱼页面。

把这个网址发给别人，别人打开就能用。

---

## 第三步（可选）：用命令行部署

如果你已经装了 Node.js，也可以不用 GitHub，直接在项目目录用 Vercel CLI 部署：

1. 在项目目录打开终端，执行：
   ```bash
   npx vercel
   ```
2. 按提示用浏览器登录 Vercel（第一次会要求登录）。
3. 问 **Set up and deploy?** 选 **Y**，问 **Which scope?** 选你的账号，问 **Link to existing project?** 选 **N**，问 **Project name?** 直接回车或用默认名，问 **In which directory is your code located?** 直接回车。
4. 等部署完成后，终端会给出一个网址。
5. **环境变量**还是要配：打开 **https://vercel.com** → 你的项目 → **Settings** → **Environment Variables**，添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`，然后到 **Deployments** 里点最新一次部署右侧的 **⋯** → **Redeploy**，重新部署一次才会生效。

---

## 常见问题

- **部署后打开是 404 或报错？**  
  检查 Vercel 里是否填了上面两个环境变量，并重新部署一次。

- **没有 Supabase 地址和密钥？**  
  如果你用的是 insforge，在 insforge 后台或项目设置里找 Project URL 和 API Key（service_role）。暂时没有也可以先部署，页面能打开，但「全球累计功德」不会存到数据库。

- **想换一个域名？**  
  在 Vercel 项目里点 **Settings** → **Domains** 可以绑定自己的域名。

按上面任选一种方式（GitHub + 网页 或 命令行）做完，就可以把链接发给别人使用了。
