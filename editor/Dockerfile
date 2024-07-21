FROM node:20.12-alpine3.18 AS build

WORKDIR /home/app

ADD . ./

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install -r --offline && \
	pnpm build

FROM node:20.12-alpine3.18 AS production

WORKDIR /home/app

ENV NODE_ENV=production

COPY --from=build /home/app/.next/static ./.next/static
COPY --from=build /home/app/.next/standalone ./
COPY --from=build /home/app/public ./public

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install --prod

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
