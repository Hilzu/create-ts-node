ARG NODE_VERSION=20


FROM node:${NODE_VERSION} AS build
ENV NODE_ENV=development
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:${NODE_VERSION}
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=build /opt/app/dist ./dist
USER node
EXPOSE 3000
CMD ["npm", "start"]
