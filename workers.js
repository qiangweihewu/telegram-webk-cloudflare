/*
 * IMPORTANT SECURITY RECOMMENDATION:
 * ------------------------------------
 * To protect your reverse proxy from abuse, prevent your worker's IP address
 * from acquiring a bad reputation, and to minimize the risk of being flagged
 * by security services, it is highly recommended to configure RATE LIMITING
 * for this worker in your Cloudflare dashboard.
 *
 * Please go to your Cloudflare account -> [Your Domain] -> Security -> WAF -> Rate Limiting Rules
 * and create rules appropriate for your expected traffic. This will help ensure
 * fair usage and stability of your service.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Redirect HTTP to HTTPS
  if (url.protocol === 'http:') {
    return Response.redirect(`https://${url.hostname}${url.pathname}${url.search}`, 301)
  }

  // Define the target host based on the path
  let targetHost
  let targetPath
  if (url.pathname.startsWith('/kws1ws/apiws')) {
    targetHost = 'kws1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws2ws/apiws')) {
    targetHost = 'kws2.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws3ws/apiws')) {
    targetHost = 'kws3.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws4ws/apiws')) {
    targetHost = 'kws4.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws5ws/apiws')) {
    targetHost = 'kws5.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws1-1ws/apiws')) {
    targetHost = 'kws1-1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws2-1ws/apiws')) {
    targetHost = 'kws2-1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws3-1ws/apiws')) {
    targetHost = 'kws3-1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws4-1ws/apiws')) {
    targetHost = 'kws4-1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/kws5-1ws/apiws')) {
    targetHost = 'kws5-1.web.telegram.org'
    targetPath = '/apiws'
  } else if (url.pathname.startsWith('/plutows/apiw1')) {
    targetHost = 'pluto.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/venusws/apiw1')) {
    targetHost = 'venus.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/auroraws/apiw1')) {
    targetHost = 'aurora.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/vestaws/apiw1')) {
    targetHost = 'vesta.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/floraws/apiw1')) {
    targetHost = 'flora.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/pluto-1ws/apiw1')) {
    targetHost = 'pluto-1.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/venus-1ws/apiw1')) {
    targetHost = 'venus-1.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/aurora-1ws/apiw1')) {
    targetHost = 'aurora-1.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/vestaws-1ws/apiw1')) {
    targetHost = 'vesta-1.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/flora-1ws/apiw1')) {
    targetHost = 'flora-1.web.telegram.org'
    targetPath = '/apiw1'
  } else if (url.pathname.startsWith('/assets/')) {
    targetHost = 'webk.telegram.org'
    targetPath = '/assets'
  } else if (url.pathname.startsWith('/stream/')) {
    targetHost = 'webk.telegram.org'
    targetPath = '/stream'
  } else {
    targetHost = 'webk.telegram.org'
    targetPath = url.pathname
  }

  // Modify the request headers
  const newHeaders = new Headers(request.headers)
  newHeaders.set('Host', targetHost)
  newHeaders.set('Referer', 'https://webk.telegram.org')
  newHeaders.set('X-Real-IP', request.headers.get('CF-Connecting-IP'))
  newHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'))
  newHeaders.set('Connection', 'upgrade')

  // Modify the request URL
  const targetUrl = new URL(request.url)
  targetUrl.hostname = targetHost
  targetUrl.pathname = targetPath + url.pathname.substring(targetPath.length)
  

  // Create a new request with the modified headers and URL
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'manual'
  })

  try {
    // Fetch the response from the target host
    const response = await fetch(modifiedRequest)

    // Check if the response is a JavaScript file and starts with "mtproto.worker"
    const contentType = response.headers.get('Content-Type')
  const fileName = url.pathname.split('/').pop()
  if (contentType && contentType.includes('javascript') && fileName.startsWith('mtproto.worker')) {
    // Read the response body as text
    const originalCode = await response.text()

    // Replace the code in the JavaScript file
    let modifiedCode = originalCode

    // IMPORTANT: In all the replacement strings below, replace 'yourdomain.com'
    // with the actual domain your Cloudflare Worker is hosted on.

    modifiedCode = modifiedCode
      // KWS servers (main)
      .replace(/wss:\/\/kws1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws1ws/apiws')
      .replace(/wss:\/\/kws2\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws2ws/apiws')
      .replace(/wss:\/\/kws3\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws3ws/apiws')
      .replace(/wss:\/\/kws4\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws4ws/apiws')
      .replace(/wss:\/\/kws5\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws5ws/apiws')
      // KWS servers (alternative)
      .replace(/wss:\/\/kws1-1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws1-1ws/apiws')
      .replace(/wss:\/\/kws2-1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws2-1ws/apiws')
      .replace(/wss:\/\/kws3-1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws3-1ws/apiws')
      .replace(/wss:\/\/kws4-1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws4-1ws/apiws')
      .replace(/wss:\/\/kws5-1\.web\.telegram\.org\/apiws/g, 'wss://yourdomain.com/kws5-1ws/apiws')
      // Main DCs (pluto, venus, etc.)
      .replace(/wss:\/\/pluto\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/plutows/apiw1')
      .replace(/wss:\/\/venus\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/venusws/apiw1')
      .replace(/wss:\/\/aurora\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/auroraws/apiw1')
      .replace(/wss:\/\/vesta\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/vestaws/apiw1')
      .replace(/wss:\/\/flora\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/floraws/apiw1')
      // Alternative DCs (pluto-1, venus-1, etc.)
      .replace(/wss:\/\/pluto-1\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/pluto-1ws/apiw1')
      .replace(/wss:\/\/venus-1\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/venus-1ws/apiw1')
      .replace(/wss:\/\/aurora-1\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/aurora-1ws/apiw1')
      .replace(/wss:\/\/vesta-1\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/vestaws-1ws/apiw1') // Note: worker path is vestaws-1ws for vesta-1 host
      .replace(/wss:\/\/flora-1\.web\.telegram\.org\/apiw1/g, 'wss://yourdomain.com/flora-1ws/apiw1');

    // Create a new response with the modified code
    const modifiedResponse = new Response(modifiedCode, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    })

    // Set the Content-Type header to application/javascript
    modifiedResponse.headers.set('Content-Type', 'application/javascript')

    // Modify the response headers
    // Replace https://your-client-domain.com with the actual domain your Telegram client is served from
    modifiedResponse.headers.set('Access-Control-Allow-Origin', 'https://your-client-domain.com')
    modifiedResponse.headers.set('Access-Control-Allow-Headers', '*')
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')

    // Add security headers
    modifiedResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    // Replace your-worker-domain.com with the actual domain your worker is served from
    modifiedResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' wss://your-worker-domain.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://your-worker-domain.com https://*.telegram.org; frame-ancestors 'none'; object-src 'none'; base-uri 'self';")
    modifiedResponse.headers.set('X-Frame-Options', 'DENY')
    modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff')
    modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return modifiedResponse
  }
  
  // For general responses, add security headers
  const newResponseHeaders = new Headers(response.headers)
  newResponseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  // Replace your-worker-domain.com with the actual domain your worker is served from
  newResponseHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' wss://your-worker-domain.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://your-worker-domain.com https://*.telegram.org; frame-ancestors 'none'; object-src 'none'; base-uri 'self';")
  newResponseHeaders.set('X-Frame-Options', 'DENY')
  newResponseHeaders.set('X-Content-Type-Options', 'nosniff')
  newResponseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newResponseHeaders
  })
  } catch (error) {
    console.error('Error fetching from origin:', error);
    return new Response('Upstream fetch failed: ' + error.message, { status: 502, statusText: 'Bad Gateway' });
  }
}
