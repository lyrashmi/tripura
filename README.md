# Deployment
Deploy using nginx.

`sudo apt update`
`sudo apt install nginx -y`
`systemctl status nginx`

For SEO and sitemap generation and update scripts node.js and npm is required.
`sudo apt install nodejs npm -y`

## Caching for images and script heavy code
### Enable /static caching

`location /static/ {
    root /var/www/tripura/static/;
    expires 7d;
    add_header Cache-Control "public, immutable";
}`

### Enable JSON caching

`location ~* \.json$ { expires 1y; add_header Cache-Control "public, immutable"; }`

Inside the server block of `/etc/nginx/sites-available/default`. This enables cache control for the page scripts and images in /static, as well as the JSON dictionary.
Check cache-control is set to "**public, immutable**" and content type is "**text/css**" via `curl -I https://tripura.io/static/styles.css`

## Caching and file reduction for JSON dictionary
### Enable brotli caching

`brotli on;`
`brotli_comp_level 6;`
`brotli_types text/plain text/css application/json application/javascript text/xml;`

Include inside the http block of `/etc/nginx/nginx.conf`. This caches the JSON dictionary and does not download on every request

### Enable file compression

`gzip on;`
`gzip_comp_level 6;`
`gzip_types text/plain text/css application/json application/javascript text/xml application/x>`

Include inside the http block of `/etc/nginx/nginx.conf`. This manages the filesize of the 90mb JSON dictionary.

## Additional nginx settings

Also check whether mime.types is activated `include /etc/nginx/mime.types;` in the same http block. 

As well as the includes `include /etc/nginx/conf.d/*.conf;` `include /etc/nginx/sites-enabled/*;`.

## Enable SSI to serve the includes
Also enable SSI inside the server block of `/etc/nginx/sites-available/default` by using `location / {
                ssi on;
                try_files $uri $uri/ =404;`.
## Check and reload nginx

Check and reload for all the above steps.
`sudo nginx -t`
`sudo systemctl reload nginx`
