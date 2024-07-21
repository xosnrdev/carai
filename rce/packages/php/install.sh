#!/usr/bin/env bash

cd ~
apt-get install -y libtool libssl-dev libcurl4-openssl-dev libxml2-dev libreadline8 libreadline-dev libzip-dev libzip4 openssl zlib1g-dev
curl -LO https://www.php.net/distributions/php-8.3.8.tar.gz
tar -zxf php-8.3.8.tar.gz
cd php-8.3.8
mkdir -p /opt/php/8.3/
./configure --prefix=/opt/php/8.3
make -j $(nproc)
make install -j $(nproc)
cd ~
rm -rf php-8.3.8.tar.gz php-8.3.8
