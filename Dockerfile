FROM oven/bun:1.1.20-debian

ENV NODE_ENV=production
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]