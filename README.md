# Telegram Web Client Proxy

> [English Version](README-EN.md) | 中文版本

一个安全、优化的Telegram Web客户端反向代理解决方案，部署在Cloudflare Workers上。

## 特性

- 🔒 **安全优化**: 添加了多层安全防护，减少被误判为恶意网站的风险
- 🚀 **性能优化**: 智能路径映射和缓存策略
- 🛡️ **反爬虫保护**: 基本的User-Agent检查和访问控制
- 🌐 **CORS支持**: 完整的跨域资源共享配置
- 📱 **WebSocket支持**: 完整支持Telegram的实时通信

## 安全改进

### 1. 路径混淆
- 将明显的Telegram相关路径改为更通用的名称
- 使用 `/api/` 和 `/cdn/` 前缀替代原有的明显标识

### 2. 安全头部
- 添加了完整的安全HTTP头部
- 包括CSP、HSTS、XSS保护等

### 3. 请求验证
- 基本的User-Agent检查
- 反爬虫机制
- IP地址记录和转发

### 4. 智能域名替换
- 更精确的JavaScript代码修改
- 避免过度替换导致的功能问题

## 部署步骤

### 1. 创建Cloudflare Worker
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Workers & Pages" 部分
3. 点击 "Create application"
4. 选择 "Create Worker"

### 2. 配置Worker
1. 将 `worker.js` 的内容复制到Worker编辑器中
2. 在代码中找到 `workerDomain` 相关部分
3. 确保域名配置正确

### 3. 设置自定义域名（推荐）
1. 在Cloudflare中添加你的域名
2. 在Worker设置中绑定自定义域名
3. 这样可以避免使用 `.workers.dev` 域名被识别

### 4. 环境变量配置（可选）
可以通过环境变量进一步自定义配置：
- `ALLOWED_ORIGINS`: 允许的来源域名
- `RATE_LIMIT`: 速率限制配置

## 路径映射

新的路径映射更加隐蔽和安全：

| 原始路径 | 新路径 | 目标服务器 |
|---------|--------|-----------|
| `/kws1ws/apiws` | `/api/ws1` | kws1.web.telegram.org |
| `/plutows/apiw1` | `/cdn/pluto` | pluto.web.telegram.org |
| `/assets/` | `/assets/` | webk.telegram.org |

## 使用方法

部署完成后，用户可以通过以下方式访问：

```
https://your-domain.com
```

所有Telegram Web客户端的请求都会被自动代理到相应的Telegram服务器。

## 安全注意事项

1. **定期更新**: 保持Worker代码的更新
2. **监控日志**: 定期检查访问日志，识别异常访问
3. **域名保护**: 使用自定义域名而非默认的workers.dev域名
4. **访问控制**: 根据需要添加更严格的访问控制

## 故障排除

### 常见问题

1. **连接失败**
   - 检查域名配置是否正确
   - 确认Cloudflare代理状态

2. **功能异常**
   - 检查JavaScript代码替换是否正确
   - 查看浏览器控制台错误信息

3. **被标记为危险网站**
   - 确保使用了自定义域名
   - 检查安全头部配置
   - 避免在域名中使用明显的Telegram相关词汇

## 技术支持

如果遇到问题，请检查：
1. Cloudflare Worker日志
2. 浏览器开发者工具
3. 网络连接状态

## 免责声明

本项目仅供学习和研究使用。使用者需要遵守当地法律法规，并对使用后果承担责任。

## 许可证

MIT License