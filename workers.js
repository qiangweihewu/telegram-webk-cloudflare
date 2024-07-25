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
  if (url.pathname.startsWith('/kws1ws/')) {
    targetHost = 'kws1.web.telegram.org'
  } else if (url.pathname.startsWith('/kws2ws/')) {
    targetHost = 'kws2.web.telegram.org'
  } else if (url.pathname.startsWith('/kws3ws/')) {
    targetHost = 'kws3.web.telegram.org'
  } else if (url.pathname.startsWith('/kws4ws/')) {
    targetHost = 'kws4.web.telegram.org'
  } else if (url.pathname.startsWith('/kws5ws/')) {
    targetHost = 'kws5.web.telegram.org'
  } else if (url.pathname.startsWith('/plutows/')) {
    targetHost = 'pluto.web.telegram.org'
  } else if (url.pathname.startsWith('/venusws/')) {
    targetHost = 'venus.web.telegram.org'
  } else if (url.pathname.startsWith('/auroraws/')) {
    targetHost = 'aurora.web.telegram.org'
  } else if (url.pathname.startsWith('/vestaws/')) {
    targetHost = 'vesta.web.telegram.org'
  } else if (url.pathname.startsWith('/floraws/')) {
    targetHost = 'flora.web.telegram.org'
  } else {
    targetHost = 'webk.telegram.org'
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

  // Create a new request with the modified headers and URL
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'manual'
  })

  // Fetch the response from the target host
  const response = await fetch(modifiedRequest)

  // Clone the response to read the body multiple times
  const responseClone = response.clone();

  // Check if the response is a JavaScript file and starts with "mtproto.worker"
  const contentType = response.headers.get('Content-Type')
  const fileName = url.pathname.split('/').pop()
  if (contentType && contentType.includes('javascript') && fileName.startsWith('mtproto.worker')) {
    // Read the response body as text
    const originalCode = await response.text()

    // Replace the code in the JavaScript file
    let modifiedCode = originalCode

    const telegramRegex = /\.web\.telegram\.org/g
    const wssRegex = /wss:\/\//g
    const plutoRegex = /pluto/g
    const venusRegex = /venus/g
    const auroraRegex = /aurora/g
    const vestaRegex =/"vesta",/g
    const floraRegex = /flora/g

    //请将下面的 your-domain.com 替换成你workers的域名或你在cloudflare DNS记录中绑定的域名
    //Please replace your-domain.com below with the domain of your workers or the domain on your DNS record
    modifiedCode = modifiedCode
      .replace(telegramRegex, 'ws')
      .replace(wssRegex, 'wss://your-domain.com/')
      .replace(plutoRegex, 'your-domain.com/pluto')
      .replace(venusRegex, 'your-domain.com/venus')
      .replace(auroraRegex, 'your-domain.com/aurora')
      .replace(vestaRegex, '"your-domain.com/vesta", ')
      .replace(floraRegex, 'your-domain.com/flora')

    // Create a new response with the modified code
    const modifiedResponse = new Response(modifiedCode, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    })

    // Set the Content-Type header to application/javascript
    modifiedResponse.headers.set('Content-Type', 'application/javascript')

    // Modify the response headers
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
    modifiedResponse.headers.set('Access-Control-Allow-Headers', '*')
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')

    return modifiedResponse
  }
  
  // Return the original response for unmodified requests
  return response
}

