FROM alpine
EXPOSE 3000
WORKDIR /app

VOLUME /Users/ruanxihao/Library/Caches/Yarn/v6 /usr/local/share/.cache/yarn/v6

COPY . template/server/*  /app/

CMD apk add nodejs yarn && yarn server:start