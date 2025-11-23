ARG NODE_VERSION=24


FROM node:${NODE_VERSION} AS build
ENV NODE_ENV=development
WORKDIR /opt/build
INSTALL_PNPM
COPY package.json PM_LOCK_FILE ./
RUN PM_INSTALL_DEV
COPY . .
RUN node --run build


FROM node:${NODE_VERSION} AS deps
ENV NODE_ENV=production
WORKDIR /opt/deps
INSTALL_PNPM
COPY package.json PM_LOCK_FILE ./
RUN PM_INSTALL_PROD && mkdir -p node_modules


FROM node:${NODE_VERSION}-slim AS app
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /opt/app

COPY package.json PM_LOCK_FILE ./
COPY --from=deps /opt/deps/node_modules ./node_modules
COPY --from=build /opt/build/dist ./dist

USER node:node
EXPOSE 3000
CMD ["node", "--run", "start"]
