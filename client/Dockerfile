FROM node:22.12.0-bookworm AS build

WORKDIR /app

COPY . .

RUN npm install -g pnpm@latest && pnpm install --frozen-lockfile && pnpm build && pnpm prune

FROM node:22.12.0-bookworm AS production

WORKDIR /app

COPY --from=build /app/web/.next/standalone/ .

COPY --from=build /app/web/public/ ./web/public/

COPY --from=build /app/web/.next/static/ ./web/.next/static/

ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "node", "./web/server.js" ]