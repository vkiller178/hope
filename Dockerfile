FROM node:12-alpine as packages

WORKDIR /app
COPY package*.json /app/
RUN npm i --production


FROM alpine

EXPOSE 3000
WORKDIR /app

RUN apk add nodejs yarn

COPY --from=packages /app /app

COPY template/*  /app/
COPY dist /app/dist
COPY build /app/build

CMD yarn server:start