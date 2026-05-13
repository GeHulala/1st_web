# 部署到阿里云轻量服务器（Ubuntu）

域名：**xinliu.glowith.top** → 服务器 IP：**139.196.82.191**

---

## 第一步：登录服务器

通过阿里云控制台登录：
1. 打开 https://swas.console.aliyun.com/
2. 找到你的轻量服务器 → 点「远程连接」
3. 输入 root 密码登录

---

## 第二步：一条一条执行以下命令

### 1. 更新系统并安装 Nginx

```bash
apt update && apt upgrade -y
apt install nginx -y
```

### 2. 确保 Nginx 运行

```bash
systemctl enable nginx
systemctl start nginx
systemctl status nginx    # 看到 active (running) 就 OK
```

### 3. 克隆网站代码

```bash
cd /var/www
git clone https://github.com/GeHulala/1st_web.git
```

### 4. 配置 Nginx 站点

```bash
cat > /etc/nginx/sites-available/xinliu << 'EOF'
server {
    listen 80;
    server_name xinliu.glowith.top;
    root /var/www/1st_web;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

### 5. 启用站点并重启 Nginx

```bash
# 先删掉默认站点（可选）
rm -f /etc/nginx/sites-enabled/default

# 启用心流工坊站点
ln -s /etc/nginx/sites-available/xinliu /etc/nginx/sites-enabled/

# 测试配置是否正确
nginx -t

# 如果测试通过，重启 Nginx
systemctl reload nginx
```

### 6. 配置防火墙（放行 80 端口）

```bash
ufw allow 80
ufw allow 'Nginx Full'
```

### 7. 测试网站

在浏览器打开：**http://xinliu.glowith.top**

能看到页面就成功了！🎉

---

## 第三步（强烈推荐）：配置 HTTPS 证书

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d xinliu.glowith.top
```

按提示输入邮箱 → 同意协议 → 选择是否重定向 HTTP 到 HTTPS（选 2）

---

## 后续更新代码

以后修改了网站代码，只需要：

```bash
# 在你的电脑上推送更新
cd d:\workspace\psych-tools-site
git add .
git commit -m "更新内容"
git push

# 然后在服务器上拉取
cd /var/www/1st_web
git pull
```

---

## 常见问题

**Q: 访问 http://xinliu.glowith.top 显示 502 Bad Gateway**
A: 检查 Nginx 是否运行：`systemctl status nginx`

**Q: 显示 403 Forbidden**
A: 检查目录权限：`chmod -R 755 /var/www/1st_web`

**Q: 域名无法访问**
A: 确认阿里云轻量服务器的防火墙已放行 80 端口：
   - 阿里云控制台 → 轻量服务器 → 防火墙 → 添加规则
   - 端口：80、443，协议：TCP
</write_to_file>
<task_progress>
- [x] 编写 DEPLOY.md 服务器部署文档
</task_progress>
</write_to_file>