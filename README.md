# 启序改标

冠乔原款号检录 → 工厂尺码自动换算成启序尺码 → 导出改标 Excel。

技术栈：React + TanStack Start（Vite）+ Tailwind + Postgres。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:8080
```

不设 `DATABASE_URL` 时，应用会自动启用内嵌的 PGLite（WASM 版 Postgres）作为本地
数据库，`migrations/*.sql` 会在启动时自动执行。数据只存在内存里，重启即清空——本地
随便改，不会动到线上数据。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器（8080） |
| `npm run build` | 生产构建 + 对 `DATABASE_URL` 执行迁移 |
| `npm run preview` | 预览构建产物（8081） |
| `npm run typecheck` | TypeScript 检查 |
| `npm run lint` | ESLint |
| `npm test` | 单元测试 |
| `npm run db:migrate` | 只跑数据库迁移 |

## 数据库

- Schema 的唯一来源是 `migrations/*.sql`，**新增表/字段一律加新的迁移文件**，不要
  在代码里内联建表。
- 迁移按文件名排序执行，已执行的记录在 `_migrations` 表（按文件名去重），重复执行
  是安全的。
- 只要设置了 `DATABASE_URL`（标准 Postgres 连接串），就会走真实数据库；Supabase /
  Neon / 自建 Postgres 都可以，无需改代码。

### 接 Supabase 的注意事项

serverless 环境下每个函数实例都会开自己的连接池，务必使用 **Supavisor transaction
pooler（6543 端口）** 的连接串，而不是直连的 5432：

```
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

## 部署

默认打包成 Vercel 产物（`.vercel/output`）：

```bash
npm run build
```

需要部署到普通 Node 服务器（比如香港轻量服务器）时，换个 Nitro preset 即可，代码
不用改：

```bash
NITRO_PRESET=node-server npm run build
node .output/server/index.mjs
```

必需的环境变量只有一个：`DATABASE_URL`。注意在 Vercel 上**构建阶段也要能读到它**，
因为 `npm run build` 结尾会执行数据库迁移。

### 函数区域

服务器函数固定跑在**香港（hkg1）**，见 `vite.config.ts` 里的 `vercel.functions.regions`
——使用者在杭州，而 Vercel 默认区域是美东，每次请求都要跨太平洋来回。香港到
新加坡的 Supabase 约 35ms，剩下的数据库往返代价很低。

改区域用 `VERCEL_FUNCTION_REGION` 环境变量即可（例如美东填 `iad1`）。注意
Vercel 面板 Settings → Functions 里的设置会覆盖这里，两边只用一处。

## 已知待办

- 款式照片目前以 base64 存在 Postgres 的 `style_assets` 表里，由 `/api/asset/$id`
  读出。数据量上去之后应迁移到对象存储。

## 字体

四套字体（Cormorant Garamond / IBM Plex Mono / Noto Sans SC / Noto Serif SC）全部
自托管在 `public/fonts/`，由 `public/fonts.css` 声明——因为 `fonts.googleapis.com`
在中国大陆无法访问，作为阻塞式样式表会拖住首屏。

`fonts.css` 保留了 Google 的 unicode-range 分片，浏览器只会下载页面实际用到的分片
（首页约 25 个 / 共 222 个）。中文可变字体的多个字重共用同一个文件，所以重复的
`@font-face` 已合并成字重区间，CSS 从 gzip 后 184KB 降到 62KB。

需要更新字体时：重新抓取 Google 的 `css2` 链接，把 `fonts.gstatic.com/s/` 换成
`/fonts/`、文件名里的 `/` 换成 `_`，字体文件下载到 `public/fonts/`。
