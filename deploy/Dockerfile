# 前端镜像：多阶段构建（构建阶段装依赖打包，运行阶段只留 nginx + 静态文件）
# 用法（在仓库根目录）：docker build -f deploy/Dockerfile -t vue3-admin-frontend .
# 或者直接用 deploy/docker-compose.prod.yml 一条命令起全套

# ---------------- 构建阶段 ----------------
FROM node:22-alpine AS builder

WORKDIR /app

# 国内服务器换成 npmmirror 会快很多；海外服务器可以传 --build-arg NPM_REGISTRY=https://registry.npmjs.org
ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG PNPM_VERSION=10
RUN npm config set registry $NPM_REGISTRY && npm i -g pnpm@$PNPM_VERSION

# 镜像里没有 .git，让 husky 跳过 git hooks 安装（否则 prepare 脚本会报错）
ENV HUSKY=0

# 先只拷依赖清单：只要依赖没变，这一层就走缓存，重建很快
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 再拷源码并打包（会读取 .env.production，接口地址是相对路径 /api）
COPY . .
RUN pnpm build

# ---------------- 运行阶段 ----------------
FROM nginx:1.27-alpine

# 站点配置：静态文件 + /api 反向代理（转发给 compose 里的 backend 服务）
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
