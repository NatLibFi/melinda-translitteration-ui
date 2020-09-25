FROM node:12-alpine as builder
WORKDIR /home/node

COPY --chown=node:node . build

# Scripts not ignored in npm ci because of node-sass
RUN apk add -U --no-cache --virtual .build-deps git sudo \
  && sudo -u node sh -c 'cd build && npm ci && npm run build && rm -rf node_modules' \
  && sudo -u node sh -c 'cp -r build/dist/* build/package.json build/package-lock.json .' \
  && git clone https://github.com/NatLibFi/USEMARCON-BOOKWHERE-RDA bookwhere_utf8 \
  && git clone https://github.com/NatLibFi/USEMARCON-kyril2880ma21 kyril2880ma21 \
  && rm -rf bookwhere_utf8/.git kyril2880ma21/.git \
  && mkdir -p /home/node/build/conf/bookwhere_utf8 \
  && mkdir -p /home/node/build/conf/kyril2880ma21 \
  && cp -arv /home/node/bookwhere_utf8/* /home/node/build/conf/bookwhere_utf8/ \
  && cp -arv /home/node/kyril2880ma21/* /home/node/build/conf/kyril2880ma21/ \
  && chown -R node:node home/node/build/conf \
  && sudo -u node sh -c 'npm ci --production'
RUN ls -la && cd build && ls -la

FROM node:12-alpine

ENV USEMARCON_BIN /usemarcon/bin/usemarcon
ENV USEMARCON_CONFIG_PATH=/conf

CMD ["/usr/local/bin/node", "index.js"]
WORKDIR /home/node
USER node
COPY --from=quay.io/natlibfi/usemarcon:3 /usemarcon /usemarcon
COPY --from=builder /home/node/build/conf/ ./conf/
COPY --from=builder /home/node/build/dist/ .
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/package.json .
COPY --from=builder /home/node/package-lock.json .
RUN ls -la