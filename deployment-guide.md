# 部署指南

## 快速部署

### 1. 准备工作

1. **注册Cloudflare账户**
   - 访问 [Cloudflare](https://www.cloudflare.com/)
   - 注册并验证邮箱

2. **准备域名（推荐）**
   - 购买一个域名
   - 将域名DNS指向Cloudflare

### 2. 创建Worker

1. **进入Workers控制台**
   ```
   https://dash.cloudflare.com/ → Workers & Pages → Create application
   ```

2. **创建新Worker**
   - 点击 "Create Worker"
   - 给Worker起一个名字（建议使用通用名称，避免包含telegram等敏感词）

3. **部署代码**
   - 复制 `worker.js` 的完整内容
   - 粘贴到Worker编辑器中
   - 点击 "Save and Deploy"

### 3. 配置自定义域名

1. **添加域名到Cloudflare**
   - 在Cloudflare控制台添加你的域名
   - 按照指引修改域名服务器

2. **绑定Worker到域名**
   - 进入 Workers & Pages
   - 选择你的Worker
   - 点击 "Settings" → "Triggers"
   - 添加自定义域名

### 4. 安全配置

1. **环境变量设置**
   ```javascript
   // 在Worker设置中添加环境变量
   WORKER_DOMAIN = "your-domain.com"
   ALLOWED_ORIGINS = "https://your-domain.com"
   ```

2. **访问控制**
   - 根据需要修改 `security-config.js` 中的配置
   - 调整速率限制和地理位置限制

## 高级配置

### 1. 多域名负载均衡

```javascript
// 在worker.js中添加多域名支持
const domains = [
  'domain1.com',
  'domain2.com',
  'domain3.com'
];

function getRandomDomain() {
  return domains[Math.floor(Math.random() * domains.length)];
}
```

### 2. 缓存优化

```javascript
// 添加缓存配置
const cacheConfig = {
  static: 86400,    // 静态资源缓存24小时
  api: 300,         // API响应缓存5分钟
  html: 3600        // HTML页面缓存1小时
};
```

### 3. 监控和日志

```javascript
// 添加请求日志
function logRequest(request, response, startTime) {
  const duration = Date.now() - startTime;
  console.log({
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    status: response.status,
    duration: duration,
    userAgent: request.headers.get('User-Agent'),
    ip: request.headers.get('CF-Connecting-IP')
  });
}
```

## 安全最佳实践

### 1. 域名选择
- ✅ 使用通用的域名名称
- ✅ 避免包含telegram、proxy、vpn等敏感词
- ✅ 选择常见的顶级域名（.com, .net, .org）

### 2. 访问控制
- ✅ 启用User-Agent检查
- ✅ 设置合理的速率限制
- ✅ 定期检查访问日志

### 3. 内容过滤
- ✅ 过滤响应中的敏感信息
- ✅ 添加适当的安全头部
- ✅ 使用HTTPS强制重定向

### 4. 监控维护
- ✅ 定期更新Worker代码
- ✅ 监控服务可用性
- ✅ 备份重要配置

## 故障排除

### 常见问题

1. **502 Bad Gateway**
   - 检查目标服务器是否可访问
   - 验证代理配置是否正确

2. **CORS错误**
   - 确认CORS头部配置正确
   - 检查预检请求处理

3. **WebSocket连接失败**
   - 验证WebSocket升级头部
   - 检查协议转换是否正确

4. **被标记为恶意网站**
   - 更换域名
   - 检查内容过滤配置
   - 联系域名注册商申诉

### 调试技巧

1. **查看Worker日志**
   ```bash
   # 使用wrangler CLI查看日志
   wrangler tail your-worker-name
   ```

2. **浏览器调试**
   - 打开开发者工具
   - 查看Network标签页
   - 检查Console错误信息

3. **测试连接**
   ```bash
   # 使用curl测试
   curl -H "User-Agent: Mozilla/5.0" https://your-domain.com/api/ws1
   ```

## 性能优化

### 1. 缓存策略
- 静态资源设置长期缓存
- API响应设置短期缓存
- 使用Cloudflare的边缘缓存

### 2. 压缩优化
- 启用Gzip/Brotli压缩
- 优化JavaScript代码大小
- 使用CDN加速静态资源

### 3. 连接优化
- 启用HTTP/2
- 使用Keep-Alive连接
- 优化DNS解析

## 法律合规

⚠️ **重要提醒**：
- 确保遵守当地法律法规
- 不要用于非法用途
- 尊重服务条款和使用协议
- 对使用后果承担责任

## 技术支持

如需帮助，请：
1. 查看Cloudflare Workers文档
2. 检查浏览器控制台错误
3. 查看Worker运行日志
4. 参考GitHub Issues（如果有开源版本）