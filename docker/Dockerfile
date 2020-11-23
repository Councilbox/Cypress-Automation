FROM node:lts as builder
WORKDIR /client
COPY . .
RUN yarn add node-sass
RUN yarn install --production
RUN yarn build


FROM nginx:latest
COPY --from=builder /client/build /client
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
