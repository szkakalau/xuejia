# 古巴雪茄零售 H5 商城

移动端雪茄商城：品牌分类、购物车、Stripe 支付（HKD）、微信客服、**商品管理后台**。

## 功能

- **分类浏览**：左侧品牌栏 + 右侧商品列表
- **商品详情**：规格、价格、加购 / 立即购买
- **购物车**：本地存储，HKD 合计
- **Stripe Checkout**：信用卡 / Apple Pay（港币）
- **客服**：微信二维码
- **管理后台**：`/admin/login` — 商品增删改（需 `ADMIN_PASSWORD`）

## 快速开始

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local：DATABASE_URL、ADMIN_PASSWORD 等

npx prisma migrate deploy
npm run db:seed

npm run dev
```

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin/login

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串（Render Postgres 外网地址） |
| `ADMIN_PASSWORD` | 后台登录密码 |
| `ADMIN_SESSION_SECRET` | 会话签名密钥（随机字符串） |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL |
| `STRIPE_*` | Stripe 支付（可选） |

## 商品数据

**线上以数据库为准。** 首次部署执行：

```bash
npx prisma migrate deploy
npm run db:seed
```

`db:seed` 从 `data/brands.json`、`data/products.json` 导入（约 205 条）。

从 PPT 重新生成 JSON：`npm run extract`（需 Python），再重新 seed。

## 管理后台

1. 访问 `/admin/login`，输入 `ADMIN_PASSWORD`
2. **商品管理**：列表筛选、新增、编辑、删除
3. 保存后前台约 60 秒内刷新（或立即访问详情页）

图片路径示例：`/products/cohiba-siglo-ii-129mm.jpg`（文件需在 `public/products/`）

## 部署（Render，推荐）

1. 在 [Render](https://render.com) 用 Blueprint 导入本仓库的 [`render.yaml`](render.yaml)，或手动创建：
   - **PostgreSQL** 数据库
   - **Web Service**：连接 GitHub `szkakalau/xuejia`
2. 环境变量：`DATABASE_URL`（可自动关联）、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`、`NEXT_PUBLIC_SITE_URL`、Stripe 相关
3. Build Command：
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
4. 首次部署后在 Render Shell 执行：`npm run db:seed`

## 部署（Vercel + Render 数据库）

1. Render 创建 Postgres，复制 **External Database URL**
2. Vercel 导入项目，设置 `DATABASE_URL` 及上述环境变量
3. Build 需包含 `prisma generate`（已写在 `package.json` 的 `build` 脚本）
4. 在本地或 CI 对生产库执行一次 `npx prisma migrate deploy && npm run db:seed`

## Stripe

本地：`stripe listen --forward-to localhost:3000/api/webhooks/stripe`

测试卡：`4242 4242 4242 4242`

## 技术栈

Next.js 15 · Prisma · PostgreSQL · TypeScript · Tailwind CSS · Stripe
