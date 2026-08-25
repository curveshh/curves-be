FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build


FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Copy schema + migrations trước
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client trong runtime
RUN pnpm prisma generate

# Copy NestJS build
COPY --from=builder /app/dist ./dist

# Nếu project có public
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main.js"]
