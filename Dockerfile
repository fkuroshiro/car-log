# Development image: runs the Expo dev server for web.
FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV EXPO_NO_TELEMETRY=1
EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
