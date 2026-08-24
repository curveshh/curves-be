FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build


FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main.js"]
