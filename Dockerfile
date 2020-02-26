FROM node:12-alpine
LABEL author="vkiller"

EXPOSE 3000
WORKDIR /app

# make yarn cached in some layer
# so, since second build,it is faster
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

COPY . /app

RUN cp /app/template/.env.server /app/.env && \
    cp /app/template/ormconfig.server.json /app/ormconfig.json && \
    yarn next:build

CMD yarn typeorm migration:run && yarn server:start