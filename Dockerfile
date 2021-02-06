FROM node:10-alpine AS node
ARG package-version

COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]