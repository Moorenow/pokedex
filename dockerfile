# 1) Dependencias solamente
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Usa el nombre correcto del lockfile
COPY package.json pnpm-lock.yaml ./

# Activa pnpm vía corepack (evita instalar pnpm global a la brava)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Instala deps (respeta el lockfile)
RUN pnpm install --frozen-lockfile

# 2) Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm build

# 3) Runtime
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --prod --frozen-lockfile

# Copia solo lo build, no tu mugrero local
COPY --from=builder /app/dist ./dist

# Si es Nest, normalmente expone 3000
EXPOSE 3000

# Arranque típico de Nest
CMD ["node", "dist/main.js"]