FROM node:18-alpine

# Instalar herramientas para compilar módulos nativos
RUN apk add --no-cache make gcc g++ python3

# Directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias (forzar compilación de bcrypt)
RUN npm install --build-from-source bcrypt

# Copiar todo el código fuente
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start:dev"]
