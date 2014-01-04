#!/usr/bin/env bash
openssl ecparam -out key.pem -name secp521r1 -genkey
openssl req -new -key key.pem  -x509 -nodes -days 3650 -out cert.pem
