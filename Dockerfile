# common build stage

FROM node:17-alpine as common-build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build


# development stage

FROM common-build as development-build

ENV NODE_ENV development


EXPOSE 5000

CMD [ "npm", "run", "dev" ]


# production stage

FROM node:17-alpine as production-build

ENV NODE_ENV production

WORKDIR /app

COPY --from=common-build /app/package*.json ./
COPY --from=common-build /app/.env ./

RUN npm install --only=production
COPY --from=common-build /app/dist ./dist/

RUN mkdir /app/dist/api/uploads
RUN chown -R node:node /app/dist/api/uploads


USER node

EXPOSE 5000

CMD [ "npm", "start" ]


