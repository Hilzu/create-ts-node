ARG NODE_VERSION=20


FROM node:${NODE_VERSION} AS build
ENV NODE_ENV=development
WORKDIR /opt/build
INSTALL_PNPM
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=PM_LOCK_FILE,target=PM_LOCK_FILE \
    --mount=type=cache,target=PM_CACHE_DIR,sharing=locked \
    PM_INSTALL
COPY . .
RUN PM_RUN build


FROM node:${NODE_VERSION} AS app
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /opt/app

COPY package.json PM_LOCK_FILE ./
INSTALL_PNPM
RUN --mount=type=cache,target=PM_CACHE_DIR,sharing=locked \
    PM_INSTALL
COPY --from=build /opt/build/dist ./dist

USER node
EXPOSE 3000
CMD NODE_START
