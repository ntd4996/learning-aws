FROM node:18-alpine AS base

# Stage 1: Development dependencies
FROM base AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production dependencies
FROM base AS prod-deps
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
RUN npm install --omit=dev

# Stage 3: Final production image
FROM base
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
