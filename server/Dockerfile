FROM rust:1.83-bookworm AS builder

WORKDIR /app

COPY . .

ENV SQLX_OFFLINE=true
ENV CARGO_TERM_COLOR=always

RUN cargo build --release

FROM debian:bookworm-slim AS runtime

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/carai /usr/local/bin

ENTRYPOINT [ "carai" ]