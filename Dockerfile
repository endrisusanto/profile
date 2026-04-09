# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Run the Express server
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy server entry point
COPY server.js .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 80

CMD ["node", "server.js"]
