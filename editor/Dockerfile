FROM node:20.12-alpine3.18 AS build

WORKDIR /app

ADD . ./

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install -r --offline && \
	pnpm build && \
	pnpm install --prod


# FROM node:20.12-alpine3.18 AS production

# WORKDIR /app

# COPY --from=build /app/.next/ ./.next
# COPY --from=build /app/package.json /app/next.config.mjs ./
# COPY --from=build /app/public ./public


# RUN npm i -g pnpm@latest && \
# 	pnpm fetch && \
# 	pnpm install --prod

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["pnpm", "start"]
