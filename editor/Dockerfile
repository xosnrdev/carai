FROM node:20.12-alpine3.18 AS build

WORKDIR /home/app

ADD . ./

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install -r --offline && \
	pnpm build

FROM node:20.12-alpine3.18 AS production

WORKDIR /home/app

COPY --from=build /home/app/.next/ ./.next
COPY --from=build /home/app/package.json ./
COPY --from=build /home/app/public ./public

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install --prod

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["pnpm", "start"]
