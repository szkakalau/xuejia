# 古巴雪茄零售 H5 商城

移动端雪茄商城：品牌分类、购物车、Stripe 支付（HKD）、微信客服二维码。

## 功能

- **分类浏览**：左侧 13 个品牌，右侧商品列表（对标银豹 H5）
- **商品详情**：规格、价格、加购 / 立即购买
- **购物车**：本地存储，HKD 合计
- **Stripe Checkout**：信用卡 / Apple Pay（港币）
- **客服**：微信二维码（替换 `public/wechat-qr.svg` 或添加 `wechat-qr.png`）
- **年龄确认**：首次访问需确认 18+

## 快速开始

```bash
npm install
npm run extract   # 从 PPT 重新导入商品（可选）
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站点 URL（生产环境填正式域名） |
| `STRIPE_SECRET_KEY` | Stripe 私钥 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公钥（预留） |
| `STRIPE_WEBHOOK_SECRET` | Webhook 签名密钥 |

## Stripe 本地测试

1. 安装 [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. 运行：`stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. 将输出的 `whsec_...` 写入 `.env.local`
4. 使用测试卡号 `4242 4242 4242 4242` 完成支付

支付成功后订单 JSON 保存在 `data/orders/`。

## 商品数据

- 来源：`古巴雪茄零售价.pptx`
- 导入：`python scripts/extract_products.py` 或 `npm run extract`
- 输出：`data/brands.json`、`data/products.json`、`public/products/`

## 微信二维码

将您的客服二维码保存为以下任一文件：

- `public/wechat-qr.svg`（默认占位，请替换）
- `public/wechat-qr.png`（若使用 PNG，请修改 `src/app/contact/page.tsx` 中的路径）

## 部署（Vercel）

1. 打开 [Vercel Dashboard](https://vercel.com/new) → **Import** 仓库 `szkakalau/xuejia`
2. **Root Directory** 留空（使用仓库根目录，确保能看到 `package.json`）
3. **Framework Preset** 选 **Next.js**（会自动识别）
4. 添加环境变量（见 `.env.example`），至少设置 `NEXT_PUBLIC_SITE_URL` 为你的 Vercel 域名（如 `https://xuejia.vercel.app`）
5. 点击 **Deploy**，等待 Build 显示 **Ready**
6. 使用 Vercel 提供的 **Production URL** 访问（不要用未部署成功的旧链接）

### 若出现 `404: NOT_FOUND`（Code: NOT_FOUND）

这是 **Vercel 没有可用部署**，不是网站页面 404。请检查：

- 部署列表里最新一次是否为 **Ready**（若为 **Error**，点开查看 Build Log）
- 访问的域名是否为当前项目的 Production URL
- 重新 **Redeploy** 一次

### Stripe Webhook

`https://您的域名/api/webhooks/stripe`，事件 `checkout.session.completed`

## 技术栈

Next.js 15 · TypeScript · Tailwind CSS · Stripe
