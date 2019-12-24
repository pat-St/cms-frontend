FROM nginx
EXPOSE 80
COPY dist/cms-frontend /usr/share/nginx/html/
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/nginx.conf