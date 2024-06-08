# Use the oven/bun base image
FROM oven/bun:latest

# Install git in the container image
RUN apt-get update && apt-get install -y git

# Clone the GitHub repository
RUN git clone https://github.com/edgarburgues/YouTubeMusicLiveSVG /app

# Set the working directory
WORKDIR /app

# Install dependencies using bun
RUN bun install

# Expose port 3000
EXPOSE 3000

# Define the default command to run your application
CMD ["bun", "src/server.js"]
