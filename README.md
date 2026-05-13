# 心流工坊 · 心理工具发布网站

基于认知行为科学、正念与积极心理学的工具产品发布页面。

## 项目说明

纯静态网站（HTML + CSS + JavaScript），无需后端环境，可直接用浏览器打开。

## 目录结构

```
psych-tools-site/
├── index.html    — 主页
├── styles.css    — 样式表
├── app.js        — 交互脚本
└── README.md     — 本文件
```

## 部署到 GitHub 步骤

### 第 1 步：安装 Git

1. 访问 https://git-scm.com/download/win
2. 下载 Windows 版本并安装（一路默认选项即可）
3. 安装完成后，打开「命令提示符」或 PowerShell，运行：
   ```bash
   git --version
   ```
   看到版本号即安装成功

### 第 2 步：配置 Git 用户信息

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 第 3 步：关联 GitHub 账号（SSH Key）

如果你还没配置过 SSH Key：
```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
# 一路回车
cat ~/.ssh/id_ed25519.pub
```
复制输出的内容，粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key

### 第 4 步：推送项目到仓库

```bash
cd d:\workspace\psych-tools-site

git init
git add .
git commit -m "feat: 心流工坊 - 心理工具发布网站"

git branch -M main
git remote add origin git@github.com:GeHulala/1st_web.git
git push -u origin main
```

### 第 5 步：部署到阿里云轻量服务器（可选）

推送成功后，通过 SSH 登录你的轻量服务器：

```bash
# 1. 安装 Nginx
apt update && apt install nginx -y        # Ubuntu
# 或
yum install nginx -y                       # CentOS

# 2. 克隆仓库
cd /var/www
git clone https://github.com/GeHulala/1st_web.git psych-tools

# 3. 配置 Nginx
cat > /etc/nginx/sites-available/psych-tools << 'EOF'
server {
    listen 80;
    server_name 你的域名.com;

    root /var/www/psych-tools;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

# 4. 启用站点
ln -s /etc/nginx/sites-available/psych-tools /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 5. 配置 HTTPS（可选，推荐）
apt install certbot python3-certbot-nginx -y
certbot --nginx -d 你的域名.com
```

</write_to_file>
<task_progress>
- [x] 编写 README.md 部署指南
</task_progress>