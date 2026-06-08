FROM node:24-slim

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]