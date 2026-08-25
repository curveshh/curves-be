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

# Copy Prisma Client đã generate từ builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Nếu có public
# COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main.js"]
