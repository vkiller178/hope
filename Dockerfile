FROM alpine

EXPOSE 3000
WORKDIR /app

RUN apk add nodejs yarn

COPY package.json /app/package.json
RUN yarn --prod

COPY . template/server/*  /app/

CMD yarn server:start