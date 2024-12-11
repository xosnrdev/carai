FROM rust:1.81-bookworm AS builder

WORKDIR /app

COPY . .

ENV SQLX_OFFLINE=true

RUN cargo build --release

FROM debian:bookworm-slim AS runtime

WORKDIR /app

COPY --from=builder /app/target/release/carai /usr/local/bin

ENTRYPOINT [ "carai" ]