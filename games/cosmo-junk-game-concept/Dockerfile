# ====== КОСМО-ХЛАМ: production-сборка в один Node-процесс ======
# ВАЖНО: комнаты хранятся в памяти процесса, поэтому запускай РОВНО ОДИН контейнер.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Заглушка только для этапа сборки (реальные запросы на билде не выполняются)
ENV DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/build_placeholder"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
COPY --from=build /app ./
EXPOSE 3000
# Боевой DATABASE_URL передаётся при запуске контейнера (-e DATABASE_URL=...)
CMD ["sh", "-c", "node scripts/ensure-db.mjs && npm start"]
