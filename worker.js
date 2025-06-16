// Enhanced Telegram Web Proxy with Security Optimizations
// 增强的Telegram Web代理，具有安全优化

class TelegramProxy {
  constructor() {
    // 使用更隐蔽的路径映射
    this.pathMappings = new Map([
      // API WebSocket endpoints - 使用更通用的路径名
      ['/api/ws1', { host: 'kws1.web.telegram.org', path: '/apiws' }],
      ['/api/ws2', { host: 'kws2.web.telegram.org', path: '/apiws' }],
      ['/api/ws3', { host: 'kws3.web.telegram.org', path: '/apiws' }],
      ['/api/ws4', { host: 'kws4.web.telegram.org', path: '/apiws' }],
      ['/api/ws5', { host: 'kws5.web.telegram.org', path: '/apiws' }],
      ['/api/ws1-alt', { host: 'kws1-1.web.telegram.org', path: '/apiws' }],
      ['/api/ws2-alt', { host: 'kws2-1.web.telegram.org', path: '/apiws' }],
      ['/api/ws3-alt', { host: 'kws3-1.web.telegram.org', path: '/apiws' }],
      ['/api/ws4-alt', { host: 'kws4-1.web.telegram.org', path: '/apiws' }],
      ['/api/ws5-alt', { host: 'kws5-1.web.telegram.org', path: '/apiws' }],
      
      // Planet endpoints - 使用更通用的命名
      ['/cdn/pluto', { host: 'pluto.web.telegram.org', path: '/apiw1' }],
      ['/cdn/venus', { host: 'venus.web.telegram.org', path: '/apiw1' }],
      ['/cdn/aurora', { host: 'aurora.web.telegram.org', path: '/apiw1' }],
      ['/cdn/vesta', { host: 'vesta.web.telegram.org', path: '/apiw1' }],
      ['/cdn/flora', { host: 'flora.web.telegram.org', path: '/apiw1' }],
      ['/cdn/pluto-alt', { host: 'pluto-1.web.telegram.org', path: '/apiw1' }],
      ['/cdn/venus-alt', { host: 'venus-1.web.telegram.org', path: '/apiw1' }],
      ['/cdn/aurora-alt', { host: 'aurora-1.web.telegram.org', path: '/apiw1' }],
      ['/cdn/vesta-alt', { host: 'vesta-1.web.telegram.org', path: '/apiw1' }],
      ['/cdn/flora-alt', { host: 'flora-1.web.telegram.org', path: '/apiw1' }]
    ]);

    // 安全头部配置
    this.securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src *; img-src * data: blob:;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };
  }

  // 获取客户端真实IP
  getClientIP(request) {
    return request.headers.get('CF-Connecting-IP') || 
           request.headers.get('X-Forwarded-For') || 
           request.headers.get('X-Real-IP') || 
           '127.0.0.1';
  }

  // 检查请求是否合法
  isValidRequest(request) {
    const userAgent = request.headers.get('User-Agent') || '';
    const referer = request.headers.get('Referer') || '';
    
    // 基本的反爬虫检查
    if (userAgent.length < 10 || 
        userAgent.includes('bot') || 
        userAgent.includes('crawler') ||
        userAgent.includes('spider')) {
      return false;
    }

    return true;
  }

  // 路径解析和映射
  resolveTarget(pathname) {
    // 检查静态资源
    if (pathname.startsWith('/assets/') || pathname.startsWith('/static/')) {
      return { host: 'webk.telegram.org', path: pathname };
    }
    
    if (pathname.startsWith('/stream/')) {
      return { host: 'webk.telegram.org', path: pathname };
    }

    // 检查API路径映射
    for (const [prefix, target] of this.pathMappings) {
      if (pathname.startsWith(prefix)) {
        const remainingPath = pathname.substring(prefix.length);
        return { 
          host: target.host, 
          path: target.path + remainingPath 
        };
      }
    }

    // 默认路径
    return { host: 'webk.telegram.org', path: pathname };
  }

  // 创建代理请求
  createProxyRequest(originalRequest, targetHost, targetPath) {
    const url = new URL(originalRequest.url);
    const targetUrl = new URL(originalRequest.url);
    targetUrl.hostname = targetHost;
    targetUrl.pathname = targetPath;

    // 创建新的请求头
    const headers = new Headers();
    
    // 复制必要的原始头部
    const allowedHeaders = [
      'accept', 'accept-encoding', 'accept-language', 'cache-control',
      'content-type', 'content-length', 'authorization', 'cookie',
      'user-agent', 'sec-websocket-key', 'sec-websocket-version',
      'sec-websocket-protocol', 'sec-websocket-extensions'
    ];

    for (const [key, value] of originalRequest.headers) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    // 设置代理相关头部
    headers.set('Host', targetHost);
    headers.set('Origin', `https://${targetHost}`);
    headers.set('Referer', `https://${targetHost}/`);
    
    // 设置真实IP
    const clientIP = this.getClientIP(originalRequest);
    headers.set('X-Real-IP', clientIP);
    headers.set('X-Forwarded-For', clientIP);
    headers.set('X-Forwarded-Proto', 'https');

    // WebSocket升级支持
    if (originalRequest.headers.get('Upgrade')) {
      headers.set('Connection', 'upgrade');
      headers.set('Upgrade', 'websocket');
    }

    return new Request(targetUrl.toString(), {
      method: originalRequest.method,
      headers: headers,
      body: originalRequest.body,
      redirect: 'manual'
    });
  }

  // 处理JavaScript文件的域名替换
  async processJavaScriptResponse(response, workerDomain) {
    const originalCode = await response.text();
    
    // 更智能的域名替换策略
    const replacements = [
      // WebSocket协议替换
      {
        pattern: /wss:\/\/([a-z0-9-]+)\.web\.telegram\.org/g,
        replacement: `wss://${workerDomain}/api/$1`
      },
      // HTTP协议替换  
      {
        pattern: /https:\/\/([a-z0-9-]+)\.web\.telegram\.org/g,
        replacement: `https://${workerDomain}/cdn/$1`
      },
      // 特殊的主机名替换
      {
        pattern: /\.web\.telegram\.org/g,
        replacement: ''
      },
      // 行星服务器名称映射
      {
        pattern: /"(pluto|venus|aurora|vesta|flora)"/g,
        replacement: `"${workerDomain}/cdn/$1"`
      }
    ];

    let modifiedCode = originalCode;
    for (const { pattern, replacement } of replacements) {
      modifiedCode = modifiedCode.replace(pattern, replacement);
    }

    return modifiedCode;
  }

  // 创建响应
  createResponse(content, originalResponse, isModified = false) {
    const headers = new Headers();
    
    // 复制原始响应头
    for (const [key, value] of originalResponse.headers) {
      headers.set(key, value);
    }

    // 添加安全头部
    for (const [key, value] of Object.entries(this.securityHeaders)) {
      headers.set(key, value);
    }

    // CORS头部
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    headers.set('Access-Control-Allow-Headers', '*');
    headers.set('Access-Control-Max-Age', '86400');

    if (isModified) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
      headers.delete('Content-Length'); // 让浏览器重新计算
    }

    return new Response(content, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: headers
    });
  }

  // 主处理函数
  async handleRequest(request) {
    try {
      const url = new URL(request.url);

      // HTTPS重定向
      if (url.protocol === 'http:') {
        return Response.redirect(`https://${url.host}${url.pathname}${url.search}`, 301);
      }

      // 处理OPTIONS预检请求
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400'
          }
        });
      }

      // 基本安全检查
      if (!this.isValidRequest(request)) {
        return new Response('Access Denied', { status: 403 });
      }

      // 解析目标
      const target = this.resolveTarget(url.pathname);
      
      // 创建代理请求
      const proxyRequest = this.createProxyRequest(request, target.host, target.path);
      
      // 发送请求
      const response = await fetch(proxyRequest);
      
      // 检查是否需要处理JavaScript文件
      const contentType = response.headers.get('Content-Type') || '';
      const isJavaScript = contentType.includes('javascript') || contentType.includes('application/javascript');
      const fileName = url.pathname.split('/').pop() || '';
      
      if (isJavaScript && (fileName.includes('mtproto') || fileName.includes('worker'))) {
        const modifiedCode = await this.processJavaScriptResponse(response, url.hostname);
        return this.createResponse(modifiedCode, response, true);
      }

      // 返回原始响应
      const responseBody = response.body;
      return this.createResponse(responseBody, response, false);

    } catch (error) {
      console.error('Proxy error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
}

// 创建代理实例
const telegramProxy = new TelegramProxy();

// 事件监听器
addEventListener('fetch', event => {
  event.respondWith(telegramProxy.handleRequest(event.request));
});