FROM node:10-alpine AS node
ARG release-version

COPY . .

RUN "ECHO $release-version"
RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh","/entrypoint.sh", "echo $release-version"]