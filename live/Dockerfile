FROM node:24-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4180
WORKDIR /app
COPY live/ ./live/
RUN mkdir -p /app/live/data && chown -R node:node /app
USER node
EXPOSE 4180
CMD ["node", "live/server.cjs"]
