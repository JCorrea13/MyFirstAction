FROM node:10-alpine AS node
ARG VERSION

COPY . .

RUN echo $VERSION

RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh","/entrypoint.sh", $VERSION]