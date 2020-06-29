FROM node:12-alpine

CMD ["/usr/local/bin/node", "index.js"]
WORKDIR /home/node

ENV USEMARCON_BIN /usemarcon/bin/usemarcon
ENV USEMARCON_CONFIG_PATH=/conf

COPY --from=quay.io/natlibfi/usemarcon:3 /usemarcon /usemarcon
COPY --chown=node:node . build

RUN apk add -U --no-cache --virtual .build-deps git sudo \
  && mkdir /conf && chown -R node:node /conf \
  && sudo -u node sh -c 'cd /conf \
    && git clone https://github.com/NatLibFi/USEMARCON-BOOKWHERE-RDA bookwhere_utf8 \
    && git clone https://github.com/NatLibFi/USEMARCON-kyril2880ma21 kyril2880ma21 \
    && rm -rf bookwhere_utf8/.git kyril2880ma21/.git' \
  && sudo -u node rm -rf build/node_modules \
  && sudo -u node sh -c 'cd build && npm install && npm run build' \
  && sudo -u node cp -r build/package.json build/dist/* . \
  && sudo -u node npm install --prod \
  && sudo -u node npm cache clean -f \
  && apk del .build-deps \
  && rm -rf build tmp/* /var/cache/apk/*

USER node

