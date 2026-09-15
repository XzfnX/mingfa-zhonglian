# 明法众联点击量统计后端：Node 24 + 内置 node:sqlite，无需原生编译
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# 依赖单独一层，package.json 未变时可复用构建缓存
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# SQLite 数据目录：由 docker-compose 挂载卷持久化
RUN mkdir -p /data && chown -R node:node /data

USER node

ENV PORT=4000 \
    DB_PATH=/data/clicks.db

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 4000) + '/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "--disable-warning=ExperimentalWarning", "src/server.js"]
