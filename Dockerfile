# ---------- 构建阶段：编译 Vite 前端 ----------
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# 容器内前后端同源，静态资源从根路径加载
ENV VITE_BASE_PATH=/
RUN npm run build

# ---------- 运行阶段：Nginx 托管静态资源并反向代理 /api ----------
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
