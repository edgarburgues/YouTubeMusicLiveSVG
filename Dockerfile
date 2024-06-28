# Dockerfile optimizado

FROM oven/bun:latest

# Instalar git
RUN apt-get update && apt-get install -y git && apt-get clean

# Copiar y instalar dependencias primero para aprovechar el cacheo
COPY package.json bun.lockb ./
RUN bun install

# Copiar el resto de la aplicación
COPY . /app

# Establecer directorio de trabajo
WORKDIR /app

# Exponer el puerto 3000
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["bun", "src/server.js"]
