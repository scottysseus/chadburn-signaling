FROM node:19-bullseye-slim

RUN npm install -g pnpm

WORKDIR /app

COPY src/ ./src/
COPY package.json pnpm-lock.yaml ./

RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod --ignore-scripts

EXPOSE 4444

CMD ["pnpm", "run", "start:prod"]