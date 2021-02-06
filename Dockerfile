FROM node:10-alpine AS node
ARG VERSION

COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]