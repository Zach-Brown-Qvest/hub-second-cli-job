FROM node:24-alpine
WORKDIR /app
RUN mkdir -p /hub/input /hub/output
COPY src ./src
ENTRYPOINT ["node", "src/transform.mjs"]
