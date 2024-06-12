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
ENV NEXT_PUBLIC_RCE_URL=https://cexaengine.com/api/execute
ENV NEXT_PUBLIC_STORAGE_KEY=4b0086cda3a8cd8e329f03a9b91f62a8b7e7a19f8cfda3f997cd32d9306ef2bf8cc41a47cba8bfa9d2a67704e00940856286dcd970b692a1935787aa39fc8c07
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
