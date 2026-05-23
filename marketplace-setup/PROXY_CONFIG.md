# Git 代理配置说明

如果 GitHub 访问有问题，可以配置 Git 使用代理。

## HTTP/HTTPS 代理

```bash
# 设置全局代理
git config --global http.proxy http://172.25.192.1:7890
git config --global https.proxy http://172.25.192.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## SOCKS5 代理

```bash
# 设置 SOCKS5 代理
git config --global http.proxy socks5://172.25.192.1:7890
git config --global https.proxy socks5://172.25.192.1:7890
```

## 仅对 GitHub 使用代理

```bash
# 只对 GitHub 使用代理
git config --global http.https://github.com.proxy http://172.25.192.1:7890
git config --global https.https://github.com.proxy http://172.25.192.1:7890
```

## 查看当前代理配置

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```
