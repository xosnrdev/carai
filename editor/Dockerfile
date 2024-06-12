FROM node:20.12-alpine3.18 AS build

WORKDIR /home/app

ADD . ./

RUN npm i -g pnpm@latest && \
	pnpm fetch && \
	pnpm install -r --offline && \
	pnpm build

FROM node:20.12-alpine3.18 AS production

RUN npm i -g pnpm@latest && \
	adduser -D carai && \
	echo "carai ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER carai

WORKDIR /home/carai/app

COPY --from=build /home/app/.next/ ./.next
COPY --from=build /home/app/package.json ./
COPY --from=build /home/app/public ./public

RUN pnpm fetch && \
	pnpm install --prod

ENV PORT=3000
ENV HOST=0.0.0.0
# ENV NEXT_PUBLIC_RCE_URL=
#	ENV NEXT_PUBLIC_STORAGE_KEY=
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["pnpm", "start"]
