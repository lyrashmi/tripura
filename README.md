# 🚀 Tripura Deployment Guide

This guide covers the Nginx server configuration required to deploy tripura.io on a Debian based VPS, optimised for performance, caching, and Server-Side Includes (SSI).

## 📋 Prerequisites

Node.js and npm are required for SEO and sitemap generation/update scripts.
```bash
sudo apt update
sudo apt install nodejs npm -y
```

## 1. Install Nginx
```bash
sudo apt install nginx -y
systemctl status nginx
```

## 2. Global Configuration (`/etc/nginx/nginx.conf`)
Add the following settings inside the `http { ... }` block. This enables MIME type resolution and aggressive data compression to manage the ~90MB JSON dictionary payload.

```nginx
http {
    # Enable MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Include external configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    # ── Gzip Compression (Fallback) ─────────────────────────
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # ── Brotli Compression (Primary, if module is installed) ─
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
    brotli_static on; # Serves pre-compressed .br files if they exist
}
```

## 3. Site Configuration (`/etc/nginx/sites-available/default`)
Configure the `server` block to enable SSI, route traffic, and apply aggressive browser caching for static assets and the dictionary.

```nginx
server {
    listen 80;
    server_name tripura.io www.tripura.io;
    root /var/www/tripura;
    index index.html;

    # Enable Server-Side Includes (SSI)
    location / {
        ssi on;
        try_files $uri $uri/ =404;
    }

    # ── Cache Static Assets (CSS, JS, Images) ───────────────
    location /static/ {
        # Note: Use 'alias' here to prevent the "double /static/" 404 trap
        alias /var/www/tripura/static/; 
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # ── Cache the 90MB JSON Dictionary ──────────────────────
    location ~* \.json$ {
        alias /var/www/tripura/static/; # Adjust path if JSON is elsewhere
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
> **⚠️ Important:** Notice the use of `alias` instead of `root` in the `/static/` block. If you use `root /var/www/tripura/static/;`, Nginx will look for `/var/www/tripura/static/static/styles.css` and return a 404. `alias` maps the URL `/static/` directly to that folder.

## 4. Verify and Reload
Always test your configuration before applying changes to ensure there are no syntax errors.

```bash
# 1. Test Nginx configuration
sudo nginx -t

# 2. If successful, reload Nginx
sudo systemctl reload nginx
```

## 5. Verify Caching Headers
Confirm that Nginx is correctly applying the cache headers to your static files by running:

```bash
curl -I https://tripura.io/static/styles.css
```

**Expected Output:**
Look for `HTTP/1.1 200 OK`, `Content-Type: text/css`, and the following headers:
```http
Cache-Control: max-age=604800, public, immutable
Expires: [Date 7 days from now]
```
