FROM natlibfi/usemarcon:v3
FROM node:8
CMD ["node", "index.js"]

WORKDIR webapp
RUN chown -R node:node /webapp

USER node

ADD --chown=node build .
ADD --chown=node package.json  .

RUN npm install --production
