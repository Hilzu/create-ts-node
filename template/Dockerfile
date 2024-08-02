ARG NODE_VERSION=20


FROM node:${NODE_VERSION} AS build
ENV NODE_ENV=development
WORKDIR /opt/app
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

# Use tini to handle signals properly
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
# You can also use `--init` flag when running `docker run` and remove these lines
ARG TARGETARCH
ENV TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-${TARGETARCH} /opt/tini
RUN chmod +x /opt/tini
ENTRYPOINT ["/opt/tini", "--"]

WORKDIR /opt/app
COPY package.json PM_LOCK_FILE ./
INSTALL_PNPM
RUN --mount=type=cache,target=PM_CACHE_DIR,sharing=locked \
    PM_INSTALL
COPY --from=build /opt/app/dist ./dist
USER node
EXPOSE 3000
CMD NODE_START
