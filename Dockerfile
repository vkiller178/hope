FROM node:12-alpine as packages

WORKDIR /app
COPY package.json /app/package.json
RUN yarn --prod


FROM alpine

EXPOSE 3000
WORKDIR /app

RUN apk add nodejs yarn

COPY --from=packages /app /app

COPy dist /app/dist

CMD yarn server:start