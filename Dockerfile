FROM node:10-alpine AS node
ARG release-version
COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh", $release-version]