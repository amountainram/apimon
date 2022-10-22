FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY .yarn ./.yarn
COPY yarn.lock ./
COPY .yarnrc.yml ./

RUN corepack enable
RUN yarn install --immutable

COPY . .

EXPOSE 5000

CMD [ "yarn", "ts-node", "src/index.ts" ]
