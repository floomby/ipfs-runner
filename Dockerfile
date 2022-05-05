FROM node:current-alpine3.14
USER root
EXPOSE 5556
RUN apk add --no-cache python3 make libc-dev g++
RUN mkdir app/
COPY ./workspaces/runner/dist/ /app/
RUN cd /app/ && npm install axios vm2 @types/node zeromq
RUN ls app/
CMD ["/app/runner.js"]