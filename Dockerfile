FROM node:latest as build
COPY package.json /usr/workdir/
WORKDIR /usr/workdir
RUN npm install
COPY . /usr/workdir
RUN npm run build --prod

FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build  /usr/workdir/dist/cms-frontend /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

RUN echo "mainFileName=\"\$(ls /usr/share/nginx/html/main*.js)\" && \
          envsubst '\$BACKEND_API_URL ' < \${mainFileName} > main.tmp && \
          mv main.tmp  \${mainFileName} && nginx -g 'daemon off;'" > run.sh
ENTRYPOINT ["sh", "run.sh"] 