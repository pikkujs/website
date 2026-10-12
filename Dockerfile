# syntax=docker/dockerfile:1
# pikku.dev origin: prerendered site + SSR for /addons and /openapis, behind Cloudflare.
# Build:  docker build -t pikku-website .      Run:  docker run -p 3000:3000 pikku-website

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
# src/data (snippets, catalogue fixtures) is committed, so the template submodule is not needed here
COPY . .
RUN npm run build

# Everything the server needs is bundled into dist/server, so no node_modules in the final image.
FROM node:22-alpine
ENV NODE_ENV=production PORT=3000 REGISTRY_URL=https://api.pikkustudio.app
WORKDIR /app
COPY package.json ./
COPY server ./server
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:${PORT}/healthz || exit 1
CMD ["node", "server/server.mjs"]
