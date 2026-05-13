# 部署到阿里云轻量服务器（Ubuntu）

域名：**xinliu.glowith.top** → 服务器 IP：**139.196.82.191**

---

## 🔑 第一步：配置 SSH 免密码登录（仅首次需要）

### 1️⃣ 用阿里云控制台登录服务器

1. 打开 https://swas.console.aliyun.com/
2. 找到你的轻量服务器 → 点击「**远程连接**」
3. 输入 root 密码登录

### 2️⃣ 在服务器上执行以下命令（一次搞定）

登录成功后，逐条复制执行：

```bash
# 创建 .ssh 目录
mkdir -p ~/.ssh

# 添加你的电脑公钥到服务器（复制整条执行）
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFM5VIo9MeUkfvnai2PFFZh5eceT6iLqDXrD0btPgAG2 ge21393951@gmail.com" >> ~/.ssh/authorized_keys

# 设置正确权限
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 开启密钥登录
sed -i 's/^#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^PubkeyAuthentication no/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# 重启 SSH 服务
systemctl restart sshd

echo "✅ SSH 免密码配置完成！"
```

### 3️⃣ 验证免密码登录

退出远程连接，然后回到你的电脑命令提示符，执行：

```bash
ssh root@139.196.82.191
```

如果能直接连接（不需要输入密码），说明配置成功了！🎉

---

## 🚀 第二步：安装 Nginx 并部署网站

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
# 先删掉默认站点
rm -f /etc/nginx/sites-enabled/default

# 启用心流工坊站点
ln -s /etc/nginx/sites-available/xinliu /etc/nginx/sites-enabled/

# 测试配置是否正确
nginx -t

# 如果测试通过，重启 Nginx
systemctl reload nginx
```

### 6. 配置防火墙

```bash
ufw allow 80
ufw allow 'Nginx Full'
```

> **注意**：还要在阿里云控制台放行端口
> 阿里云控制台 → 轻量服务器 → 防火墙 → 添加规则 → 端口：80、443，协议：TCP

### 7. 测试网站

浏览器打开：**http://xinliu.glowith.top**

能看到心流工坊页面就成功了！🎉

---

## 🔒 第三步：配置 HTTPS 证书（强烈推荐）

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d xinliu.glowith.top
```

按提示：输入邮箱 → 同意协议 → 选择是否重定向（选 2，自动跳转 HTTPS）

---

## 🔄 后续更新代码

```bash
# 在你的电脑上修改代码后
cd d:\workspace\psych-tools-site
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "更新内容"
"C:\Program Files\Git\cmd\git.exe" push

# 然后在服务器上拉取
ssh root@139.196.82.191 "cd /var/www/1st_web && git pull"
```

---

## ⚠️ 常见问题

**Q: http://xinliu.glowith.top 访问不了**
A: 排查三步：
1. 阿里云轻量服务器防火墙是否放行了 80 端口？
2. `systemctl status nginx` 是否运行中？
3. 域名解析是否生效？`ping xinliu.glowith.top`

**Q: 显示 403 Forbidden**
A: `chmod -R 755 /var/www/1st_web`

**Q: 显示 502 Bad Gateway**
A: `systemctl restart nginx`