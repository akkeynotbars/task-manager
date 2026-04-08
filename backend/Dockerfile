FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "--watch", "src/index.js"]

FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
EXPOSE 3001
CMD ["node", "src/index.js"]