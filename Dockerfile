FROM node:18 AS builder

WORKDIR /app

COPY . .

# Install app dependencies
RUN npm ci
RUN npm run generate
RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]