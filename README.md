Include caching for images and script heavy code inside `/etc/nginx/sites-available/default` in the server block:
`location /static/ {
    root /var/www/tripura/static/;
    expires 7d;
    add_header Cache-Control "public, immutable";
}`

Enable brotly caching
`brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml;`

And file compression
`gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/x>`

In the http block inside `/etc/nginx/nginx.conf`. This ensures the 90mb dictionary .JSON does not download on every request and manages its filesize.
