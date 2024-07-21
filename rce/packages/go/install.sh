#!/usr/bin/env bash

VERSION="1.22.4"
RELEASE_URL="https://go.dev/dl/go${VERSION}.linux-amd64.tar.gz"
INSTALL_DIR="/opt/go/${VERSION}"

cd ~
curl -LO ${RELEASE_URL}
mkdir -p ${INSTALL_DIR}
tar -C ${INSTALL_DIR} -xzf go${VERSION}.linux-amd64.tar.gz
rm go${VERSION}.linux-amd64.tar.gz
