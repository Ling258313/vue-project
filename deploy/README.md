# 上线部署清单（硅谷甄选前端）

这份文档配合 deploy 目录里的三个文件使用：Dockerfile、nginx.conf、docker-compose.prod.yml。

## 0. 先理解一张图

    浏览器
      |  http://服务器IP/            -> Nginx 把前端静态文件(index.html / assets/*)发回去
      |  http://服务器IP/api/xxx     -> Nginx 转发成 http://backend:10086/xxx 交给 Go 后端
                                          Go 后端再连 mysql:3306 查数据

三个关键点：

1. **前端只写相对路径 /api**，永远不知道后端在哪台机器、哪个端口。所以同一份 dist 可以部署到任何服务器，不用重新打包。
2. **只有 Nginx 对外开端口**（80，以后加 443）。后端 10086、数据库 3306 都只在 Docker 内网里，公网碰不到。
3. 因为前端和接口是**同源**的，所以**不会有跨域问题**，也不会出现"HTTPS 页面请求 HTTP 接口"被浏览器拦截。

## 1. 前置准备

- 一台 Linux 服务器（2 核 2G 起就够，Go 后端很省内存，吃内存的是 MySQL）
- 服务器上装好 Docker 和 Docker Compose 插件
- 两个仓库都在服务器上，并且**放在同级目录**：

  ~/apps/
  ├── project/ <- 前端仓库（本仓库）
  └── vue3_admin_backend/ <- 后端仓库

  前端仓库里 deploy/docker-compose.prod.yml 默认按 ../../vue3_admin_backend 找后端，如果你的目录不同，改 .env 里的 BACKEND_CONTEXT 即可。

Ubuntu 装 Docker（官方脚本）：

    curl -fsSL https://get.docker.com | sh
    sudo systemctl enable --now docker
    docker compose version     # 确认插件存在

## 2. 五步上线

**第 1 步：准备配置文件**

    cd ~/apps/project/deploy
    cp .env.example .env
    vi .env        # 改掉里面的数据库密码

.env 里的几项：

    HTTP_PORT=80                                  # 对外端口
    MYSQL_ROOT_PASSWORD=换成强密码
    MYSQL_DATABASE=vue3_admin
    MYSQL_USER=vue3_admin
    MYSQL_PASSWORD=换成另一个强密码
    BACKEND_CONTEXT=../../vue3_admin_backend      # 后端仓库位置
    NPM_REGISTRY=https://registry.npmmirror.com   # 国内服务器用这个，海外改成官方源

注意：deploy/.env 已经在 .gitignore 里，**千万别提交**。

**第 2 步：一条命令起全套**

    cd ~/apps/project/deploy
    docker compose -f docker-compose.prod.yml up -d --build

第一次会：拉镜像 -> 构建前端（装依赖 + pnpm build，2 核机器大概 1 到 3 分钟）-> 构建后端 Go 镜像 -> 启动 MySQL 并自动执行 init-sql 里的建表脚本（只在数据目录为空时执行一次）。

**第 3 步：确认容器都起来了**

    docker compose -f docker-compose.prod.yml ps

看到三个服务都是 Up（mysql 是 healthy）就对了。MySQL 第一次初始化要十几秒，backend 会等它健康后再启动。

顺手确认一下 Nginx 配置本身没问题（改过 nginx.conf 之后尤其要跑）：

    docker compose -f docker-compose.prod.yml exec frontend nginx -t

看到 syntax is ok / test is successful 就放心了。

**第 4 步：开安全组**

到云厂商控制台，安全组**只放行 80（以后加 443）**，以及你自己登录用的 SSH 端口（22）。

**不要**放行 3306 和 10086 —— 它们本来就没映射到宿主机，但也别画蛇添足去加。

**第 5 步：浏览器验证**

    http://你的服务器IP

用默认账号 admin / 111111 登录，能看到首页、商品管理、权限管理就说明通了。

## 3. 上线后必须马上做的三件事

**① 改掉默认密码（最重要）**

这套后端的密码算法是"明文 + 固定盐"：

    encryptPassword(pwd) = hex( pwd + md5("devops") )

也就是说数据库里那条密码字段**前缀就是你的明文密码的十六进制**，拿到库等于拿到密码。所以：

- 推荐做法：进"用户管理"新建一个管理员账号（设置你自己的强密码），给它分配超级管理员角色，然后把 admin 这个用户删掉；
- 应急做法（直接改库，md5("devops") 固定是 a21c218df41f6d7fd032535fe20394e2）：

  docker compose -f docker-compose.prod.yml exec mysql \
  mysql -uroot -p vue3_admin \
  -e "UPDATE user SET password = CONCAT(HEX('你的新密码'), 'a21c218df41f6d7fd032535fe20394e2') WHERE username = 'admin';"

**② 确认数据库没暴露**

    docker compose -f docker-compose.prod.yml ps       # mysql 那一行不应该有 0.0.0.0:3306

**③ 把 .env 权限收紧，并关掉调试入口**

后端自带 /swagger 和 /health，课程演示无所谓，真要上线建议在 Nginx 里把 /api/swagger 挡掉（在 nginx.conf 的 /api/ 前面加一段 location ^~ /api/swagger { return 404; }）。

## 4. 加域名和 HTTPS（可选）

1. 域名解析：A 记录指向服务器 IP；
2. 申请免费证书：

   sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com # 需要先停掉占 80 端口的 nginx

3. 把证书挂进前端容器：在 docker-compose.prod.yml 的 frontend 服务里加

   volumes:
   - /etc/letsencrypt/live/your-domain.com:/etc/nginx/certs:ro
     ports:
   - "80:80"
   - "443:443"

   （同时把 HTTP_PORT 那段替换掉，或者直接把 443 也映射出来）

4. 打开 deploy/nginx.conf 里注释好的 HTTPS 段，把证书路径对上，并且把 80 端口那段改成 return 301 https://$host$request_uri；
5. 重新加载：

   docker compose -f docker-compose.prod.yml up -d --build
   docker compose -f docker-compose.prod.yml exec frontend nginx -s reload

6. 证书自动续期：certbot 的 renew 钩子里加一条 docker compose exec frontend nginx -s reload。

## 5. 日常运维

看日志：

    docker compose -f docker-compose.prod.yml logs -f frontend
    docker compose -f docker-compose.prod.yml logs -f backend

更新前端（改了代码之后）：

    cd ~/apps/project && git pull
    cd deploy && docker compose -f docker-compose.prod.yml up -d --build frontend

备份数据库（建议加到 crontab，每天一次）：

    docker compose -f docker-compose.prod.yml exec -T mysql \
      mysqldump -uroot -p$MYSQL_ROOT_PASSWORD vue3_admin > ~/backup-$(date +%F).sql

恢复：

    cat ~/backup-2026-09-10.sql | docker compose -f docker-compose.prod.yml exec -T mysql \
      mysql -uroot -p$MYSQL_ROOT_PASSWORD vue3_admin

彻底重来（会删库，谨慎）：

    docker compose -f docker-compose.prod.yml down -v

## 6. 常见故障排查

| 现象                        | 原因                                       | 怎么办                                                                                                             |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 打开是 Nginx 欢迎页         | 前端镜像没构建成功，或者 80 被别的服务占了 | docker compose logs frontend 看日志；ss -lntp 看 80 端口                                                           |
| 页面能开但登录报错/接口 404 | /api 没转发对                              | 检查 nginx.conf 里 proxy_pass 结尾的斜杠（少了它 /api 前缀就去不掉）；docker compose logs backend 看有没有请求进来 |
| 接口 502                    | 后端容器没起来 / 崩了                      | docker compose logs backend；多半是 MySQL 没连上，确认 .env 里密码和 mysql 服务一致                                |
| 数据库空了                  | 重建过容器卷                               | 检查有没有执行过 down -v；用备份恢复                                                                               |
| 上传图片 413                | 请求体超过 Nginx 限制                      | nginx.conf 里 client_max_body_size 调大                                                                            |
| 前端改了没生效              | 浏览器缓存了 index.html                    | 我们的 index.html 已设置不缓存；如果是老的 nginx 配置，硬刷新一次                                                  |

## 7. 本机提前演练（不用买服务器）

前端已经改成相对路径 /api，本机也能完整模拟线上：

    pnpm dev          # 开发模式：Vite 自己代理 /api -> 127.0.0.1:10086
    pnpm build        # 打包
    pnpm preview      # 预览打包产物：同样通过 preview.proxy 转发 /api

也就是说"本机 pnpm preview 能跑通"约等于"线上 Nginx 那套也能跑通"，因为两边做的事是一样的：把 /api 转发到后端。

## 8. 文件说明

| 文件                           | 作用                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| deploy/Dockerfile              | 前端镜像：node 构建 + nginx 运行（多阶段）                    |
| deploy/nginx.conf              | 站点配置：静态文件、缓存策略、/api 反向代理、HTTPS 段（注释） |
| deploy/docker-compose.prod.yml | 三个服务编排：frontend / backend / mysql                      |
| deploy/.env.example            | 密码与端口模板，复制成 .env 后修改                            |
| .dockerignore                  | 构建上下文瘦身（node_modules、dist、.git 不进镜像）           |
