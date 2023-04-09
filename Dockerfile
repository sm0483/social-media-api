FROM node:17-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:17-alpine


WORKDIR /app

COPY --from=0 /app/package*.json .
COPY --from=0 /app/.env .

RUN npm install --only=production

COPY --from=0 /app/dist ./dist

USER node

EXPOSE 5000

CMD [ "node", "dist/index.js" ]