FROM node:10-alpine AS node
ARG release-version
COPY . .

RUN ls

RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh","entrypoint.sh", "$release-version"]