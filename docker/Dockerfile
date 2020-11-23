FROM node:12-slim as builder
RUN apt-get update && apt-get install git -y
WORKDIR /client
COPY . .
RUN yarn install --production
RUN yarn build


FROM nginx:latest
COPY --from=builder /client/build /client
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
