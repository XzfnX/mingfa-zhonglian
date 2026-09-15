# 明法众联

面向个人、机构与管理员三层身份分区的数智化法治实践平台。

## 在线演示

[打开 GitHub Pages 演示](https://xzfnx.github.io/mingfa-zhonglian/)

## 本地启动

```bash
npm install
npm run dev
```

## 体验账号

- 个人端：`13800000001` / `123456`
- 司法局：`justice@demo.cn` / `demo123`
- 街道政府：`street@demo.cn` / `demo123`
- 学校：`school@demo.cn` / `demo123`
- 企业：`enterprise@demo.cn` / `demo123`
- 管理员：`admin@mingfa.cn` / `admin123`

机构账号仅能访问所属机构工作台；管理员可以查看全部四类机构后台。

## 网站点击量统计

点击量由 `backend/` 下的 Express + SQLite 服务统计，前端只调用接口、不在本地累计数据。

| 接口 | 说明 |
| --- | --- |
| `GET /api/clicks` | 获取当前累计点击量 |
| `POST /api/clicks` | 累计点击量原子 +1，并返回最新值 |
| `GET /api/health` | 健康检查（Docker healthcheck 使用） |

- 有效点击来源：进入站点时记一次访问点击（同一标签页只记一次）；点击登录入口的「登录并进入系统」再记一次。
- 累计值以 SQLite 中的记录为唯一数据源（`backend/src/db.js`），页面展示的数值始终来自接口返回。
- 后端未部署时前端不会伪造数据，点击量位置显示为「—」。

## Docker 部署（Ubuntu 24.04）

```bash
docker compose up -d --build
```

启动后访问 `http://<服务器IP>:8080`。容器组成：

- `web`：Nginx 托管 Vite 构建产物，并把 `/api` 反向代理到 `backend:4000`（前后端同源，无跨域问题）。
- `backend`：Node 24 + Express + SQLite，数据库文件挂在具名卷 `clicks-data:/data`。

数据持久化：具名卷 `clicks-data`，容器重启、`docker compose down`、`docker compose up --build` 重新部署、服务器重启都不会丢失数据。
只有 `docker compose down -v`（显式删除卷）才会清空点击量。

```bash
docker compose ps                          # 查看服务状态
docker compose logs -f backend             # 查看后端日志
docker compose down                        # 停止服务（数据保留）
docker volume inspect mingfa-zhonglian_clicks-data   # 查看数据卷位置
```

如需把数据库放到宿主机目录便于备份，把 `docker-compose.yml` 中的 `clicks-data:/data` 换成 `./data:/data`，并先执行 `sudo chown -R 1000:1000 ./data`。

## 本地开发

```bash
# 终端 1：后端（默认 http://localhost:4000，数据库在 backend/data/clicks.db）
cd backend
npm install
npm start

# 终端 2：前端（Vite 已把 /api 代理到 4000，无需额外配置）
npm install
npm run dev
```

前端单独部署（例如 GitHub Pages）需要直连后端时，构建前设置 `VITE_API_BASE=https://api.example.com`，
并在后端设置 `ALLOWED_ORIGIN=https://xzfnx.github.io` 放开跨域。
