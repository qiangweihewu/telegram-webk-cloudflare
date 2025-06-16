// 安全配置文件
// Security Configuration

export const SecurityConfig = {
  // 允许的User-Agent模式
  allowedUserAgents: [
    /Mozilla\/5\.0/,
    /Chrome\/\d+/,
    /Safari\/\d+/,
    /Firefox\/\d+/,
    /Edge\/\d+/
  ],

  // 被禁止的User-Agent模式
  blockedUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i
  ],

  // 速率限制配置
  rateLimit: {
    windowMs: 60000, // 1分钟
    maxRequests: 100, // 每分钟最多100个请求
    skipSuccessfulRequests: false
  },

  // 地理位置限制（可选）
  geoBlocking: {
    enabled: false,
    allowedCountries: [], // 空数组表示允许所有国家
    blockedCountries: [] // 可以添加需要屏蔽的国家代码
  },

  // 安全头部配置
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src *",
      "img-src * data: blob:",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "worker-src 'self' blob:"
    ].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // 路径白名单
  allowedPaths: [
    /^\/api\//,
    /^\/cdn\//,
    /^\/assets\//,
    /^\/static\//,
    /^\/stream\//,
    /^\/$/,
    /^\/index/,
    /^\/favicon/
  ],

  // 文件类型白名单
  allowedFileTypes: [
    'html', 'css', 'js', 'json', 'woff', 'woff2', 'ttf',
    'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp'
  ],

  // 敏感信息过滤
  sensitiveDataFilters: [
    /telegram/gi,
    /mtproto/gi,
    /api[_-]?key/gi,
    /secret/gi,
    /token/gi,
    /password/gi
  ]
};

// 安全检查函数
export class SecurityChecker {
  static isValidUserAgent(userAgent) {
    if (!userAgent || userAgent.length < 10) return false;
    
    // 检查是否匹配被禁止的模式
    for (const pattern of SecurityConfig.blockedUserAgents) {
      if (pattern.test(userAgent)) return false;
    }
    
    // 检查是否匹配允许的模式
    for (const pattern of SecurityConfig.allowedUserAgents) {
      if (pattern.test(userAgent)) return true;
    }
    
    return false;
  }

  static isValidPath(pathname) {
    for (const pattern of SecurityConfig.allowedPaths) {
      if (pattern.test(pathname)) return true;
    }
    return false;
  }

  static sanitizeResponse(content) {
    let sanitized = content;
    
    // 移除敏感信息
    for (const filter of SecurityConfig.sensitiveDataFilters) {
      sanitized = sanitized.replace(filter, '[FILTERED]');
    }
    
    return sanitized;
  }

  static getSecurityHeaders() {
    return new Headers(SecurityConfig.securityHeaders);
  }
}