# Enable caching for images and script heavy code

`location /static/ {
    root /var/www/tripura/static/;
    expires 7d;
    add_header Cache-Control "public, immutable";
}`

Include inside the server block of `/etc/nginx/sites-available/default`.
Check cache-control is set to "public, immutable" and content type is "text/css" with `curl -I https://tripura.io/static/styles.css`

# Caching and file reduction for JSON dictionary
### Enable brotly caching

`brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml;`

### And file compression

`gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/x>`

Include inside the http block of `/etc/nginx/nginx.conf`. This ensures the 90mb dictionary .JSON does not download on every request and manages its filesize.
