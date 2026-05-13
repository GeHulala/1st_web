# 心流工坊 · 部署文档

域名：**xinliu.glowith.top** → 服务器 IP：**139.196.82.191**

---

## 🔑 先配 SSH 免密码（只需一次）

### 步骤 1：阿里云控制台登录

打开 https://swas.console.aliyun.com/ → 找到服务器 → 点「远程连接」→ 输入 root 密码

### 步骤 2：添加你的电脑公钥

登录进去后，复制粘贴以下**一整段**命令执行：

```bash
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFM5VIo9MeUkfvnai2PFFZh5eceT6iLqDXrD0btPgAG2 ge21393951@gmail.com" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
sed -i 's/^#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^PubkeyAuthentication no/PubkeyAuthentication yes/' /etc/ssh/sshd_config
systemctl restart sshd
echo "✅ 完成"
```

### 步骤 3：验证

退出远程连接，在本地命令提示符执行：
```bash
ssh root@139.196.82.191
```
能直接连上（不输密码）就成功了。

---

## 🌐 配置 HTTPS 证书（解决"不安全"提示）

SSH 免密配置成功后（或继续用阿里云控制台），在服务器执行：

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx -y

# 申请证书（会弹交互提示）
certbot --nginx -d xinliu.glowith.top
```

执行后会问几个问题：

| 提示 | 回答 |
|------|------|
| 输入邮箱 | `ge21393951@gmail.com` 然后回车 |
| 同意协议 (A/C) | 输入 `A` 回车 |
| 是否接收邮件 (Y/N) | 输入 `N` 回车 |
| 是否重定向 (1/2) | 输入 `2` 回车（HTTP自动跳HTTPS） |

### 验证

浏览器打开 **https://xinliu.glowith.top**，地址栏应该显示 🔒 小锁，不再提示"不安全"。

---

## 🚀 后续更新代码

```bash
# 本地修改代码后
cd d:\workspace\psych-tools-site
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "更新内容"
"C:\Program Files\Git\cmd\git.exe" push

# 服务器拉取
ssh root@139.196.82.191 "cd /workspace/1st_web && git pull"
```
