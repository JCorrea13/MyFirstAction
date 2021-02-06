FROM node:10-alpine AS node
ARG release-version

RUN cd /github/workspace
COPY . .



RUN ls

RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh","entrypoint.sh", "$release-version"]