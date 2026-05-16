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

**注意：** Render 免费账户只能有 **1 个** 免费 PostgreSQL。若 Blueprint 报错 `cannot have more than one active free tier database`，请复用已有数据库（见下方「方案 A」）。

### 方案 A：已有免费 Postgres（最常见）

1. [Render Dashboard](https://dashboard.render.com) → 打开你**现有的** PostgreSQL → **Connections** → 复制 **Internal Database URL**
2. **New +** → **Blueprint** → 选仓库 `szkakalau/xuejia`（使用根目录 [`render.yaml`](render.yaml)，**不会**再创建新库）
3. 手动填写环境变量：
   - `DATABASE_URL` = 上一步复制的 Internal URL
   - `ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET` = 自行设置
   - `NEXT_PUBLIC_SITE_URL` = 部署成功后的 `https://xuejia.onrender.com`
4. 部署完成后在 Web Service **Shell** 执行：`npm run db:seed`

### 方案 B：账户里还没有任何免费库

使用 [`render-with-database.yaml`](render-with-database.yaml) 创建 Blueprint（会同时创建 `xuejia-db` + Web 服务）。

### 方案 C：手动创建

1. 创建 **Web Service**，连接 GitHub `szkakalau/xuejia`
2. 环境变量：`DATABASE_URL`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`、`NEXT_PUBLIC_SITE_URL`、Stripe 相关
3. Build / Start（见 `render.yaml`）：
   - Build：`npm install && npx prisma generate && npm run build`
   - Start：`sh scripts/render-start.sh`（共享库若报 P3005 会自动 `db push`）
4. 环境变量 **必须**填写 `DATABASE_URL`，否则部署失败
5. 首次 Live 后在 Shell 执行：`npm run db:seed`

## 部署（Vercel + Render 数据库）

1. Render 创建 Postgres，复制 **External Database URL**
2. Vercel 导入项目，设置 `DATABASE_URL` 及上述环境变量
3. Build 需包含 `prisma generate`（已写在 `package.json` 的 `build` 脚本）
4. 在本地或 CI 对生产库执行一次 `npx prisma migrate deploy`（或 `npx prisma db push`）与 `npm run db:seed`

### 共享数据库（P3005）

若 `DATABASE_URL` 指向已有其它项目表的库（如 `ai_trend_forge` 的 `public.users`），`migrate deploy` 会报 **P3005**。本项目表在 PostgreSQL **`xuejia` schema** 下，启动脚本会回退为 `prisma db push`，**不会**删除 `public` 里其它应用的表。切勿对共享库使用 `db push --accept-data-loss`。

部署 Live 后在 Shell：`npm run db:seed`

## Stripe

本地：`stripe listen --forward-to localhost:3000/api/webhooks/stripe`

测试卡：`4242 4242 4242 4242`

## 技术栈

Next.js 15 · Prisma · PostgreSQL · TypeScript · Tailwind CSS · Stripe
