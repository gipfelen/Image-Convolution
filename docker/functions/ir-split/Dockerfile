FROM node:14-alpine

WORKDIR /usr/src/app
RUN cd /usr/src/app && npm install aws-sdk
COPY * .
ENTRYPOINT ["node", "docker-runtime.js" ]