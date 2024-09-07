# Usar una imagen base de Node.js
FROM node:18-bullseye

# Instalar Bun manualmente
RUN curl -fsSL https://bun.sh/install | bash

# Hacer que Bun esté disponible en el PATH
ENV BUN_INSTALL=/root/.bun
ENV PATH=$BUN_INSTALL/bin:$PATH

# Crear el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y bun.lockb
COPY package.json bun.lockb ./

# Instalar las dependencias usando Bun
RUN bun install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["bun", "start"]
