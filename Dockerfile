FROM node:12-alpine as packages

WORKDIR /app
COPY package.json /app/package.json
# COPY yarn.lock /app/yarn.lock
RUN yarn --prod


FROM alpine

EXPOSE 3000
WORKDIR /app

RUN apk add nodejs yarn

COPY --from=packages /app/node_modules /app/

COPY package.json dist template/server/*  /app/

CMD yarn server:start