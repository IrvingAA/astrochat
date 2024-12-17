# Stage 1: Base image
FROM node:22 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development
RUN npm install --only=development
CMD ["sh", "-c", "npx ts-node src/scripts/run-seeders.ts && npm run start:dev"]

# Stage 3: Production
FROM base AS production
ENV NODE_ENV=production
RUN npm run build
CMD ["node", "dist/main"]
