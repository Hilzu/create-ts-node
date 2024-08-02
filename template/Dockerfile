ARG NODE_VERSION=20


FROM node:${NODE_VERSION} AS build
ENV NODE_ENV=development
WORKDIR /opt/app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build


FROM node:${NODE_VERSION} AS app

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY --from=build /opt/app/dist ./dist
USER node
EXPOSE 3000
CMD ["npm", "start"]
