FROM node:20.9.0-alpine3.18 AS build

WORKDIR /app

COPY . .
RUN npm i && npm run build

FROM nginx:1.25.2
COPY --from=build /app/dist /etc/nginx/app/
COPY nginx.conf /etc/nginx/conf.d/app.conf
EXPOSE 3000
CMD ["sh", "-c", "cd /etc/nginx/app/ && nginx -g 'daemon off;'"]