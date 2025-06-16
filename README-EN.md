# Telegram Web Client Proxy

A secure, optimized Telegram Web client reverse proxy solution deployed on Cloudflare Workers.

## Features

- 🔒 **Security Optimized**: Multi-layer security protection to reduce the risk of being flagged as malicious
- 🚀 **Performance Optimized**: Smart path mapping and caching strategies
- 🛡️ **Anti-Bot Protection**: Basic User-Agent checking and access control
- 🌐 **CORS Support**: Complete Cross-Origin Resource Sharing configuration
- 📱 **WebSocket Support**: Full support for Telegram's real-time communication

## Security Improvements

### 1. Path Obfuscation
- Changed obvious Telegram-related paths to more generic names
- Uses `/api/` and `/cdn/` prefixes instead of obvious identifiers

### 2. Security Headers
- Added comprehensive security HTTP headers
- Includes CSP, HSTS, XSS protection, etc.

### 3. Request Validation
- Basic User-Agent checking
- Anti-crawler mechanisms
- IP address logging and forwarding

### 4. Smart Domain Replacement
- More precise JavaScript code modification
- Avoids over-replacement that could break functionality

## Deployment Steps

### 1. Create Cloudflare Worker
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "Workers & Pages" section
3. Click "Create application"
4. Select "Create Worker"

### 2. Configure Worker
1. Copy the contents of `worker.js` to the Worker editor
2. Find the `workerDomain` related parts in the code
3. Ensure domain configuration is correct

### 3. Set Custom Domain (Recommended)
1. Add your domain to Cloudflare
2. Bind custom domain in Worker settings
3. This avoids using `.workers.dev` domain which can be easily identified

### 4. Environment Variables (Optional)
You can further customize configuration through environment variables:
- `ALLOWED_ORIGINS`: Allowed origin domains
- `RATE_LIMIT`: Rate limiting configuration

## Path Mapping

New path mapping is more discreet and secure:

| Original Path | New Path | Target Server |
|---------------|----------|---------------|
| `/kws1ws/apiws` | `/api/ws1` | kws1.web.telegram.org |
| `/plutows/apiw1` | `/cdn/pluto` | pluto.web.telegram.org |
| `/assets/` | `/assets/` | webk.telegram.org |

## Usage

After deployment, users can access via:

```
https://your-domain.com
```

All Telegram Web client requests will be automatically proxied to the corresponding Telegram servers.

## Security Considerations

1. **Regular Updates**: Keep Worker code updated
2. **Monitor Logs**: Regularly check access logs to identify abnormal access
3. **Domain Protection**: Use custom domains instead of default workers.dev domains
4. **Access Control**: Add stricter access control as needed

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if domain configuration is correct
   - Confirm Cloudflare proxy status

2. **Functionality Issues**
   - Check if JavaScript code replacement is correct
   - View browser console error messages

3. **Flagged as Dangerous Website**
   - Ensure using custom domain
   - Check security header configuration
   - Avoid obvious Telegram-related words in domain

## Technical Support

If you encounter issues, please check:
1. Cloudflare Worker logs
2. Browser developer tools
3. Network connection status

## Configuration Files

- `worker.js`: Main Worker code with enhanced security
- `security-config.js`: Independent security configuration
- `deployment-guide.md`: Detailed deployment guide (Chinese)

## Best Practices

### Domain Selection
- ✅ Use generic domain names
- ✅ Avoid sensitive words like telegram, proxy, vpn
- ✅ Choose common TLDs (.com, .net, .org)

### Access Control
- ✅ Enable User-Agent checking
- ✅ Set reasonable rate limits
- ✅ Regularly check access logs

### Content Filtering
- ✅ Filter sensitive information in responses
- ✅ Add appropriate security headers
- ✅ Use HTTPS forced redirect

### Monitoring & Maintenance
- ✅ Regularly update Worker code
- ✅ Monitor service availability
- ✅ Backup important configurations

## Performance Optimization

### 1. Caching Strategy
- Set long-term cache for static resources
- Set short-term cache for API responses
- Use Cloudflare's edge caching

### 2. Compression Optimization
- Enable Gzip/Brotli compression
- Optimize JavaScript code size
- Use CDN for static resource acceleration

### 3. Connection Optimization
- Enable HTTP/2
- Use Keep-Alive connections
- Optimize DNS resolution

## Legal Compliance

⚠️ **Important Notice**:
- Ensure compliance with local laws and regulations
- Do not use for illegal purposes
- Respect terms of service and usage agreements
- Take responsibility for usage consequences

## Disclaimer

This project is for educational and research purposes only. Users must comply with local laws and regulations and are responsible for the consequences of use.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this project helpful, please consider giving it a star ⭐