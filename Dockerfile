# Use uma imagem Node.js como base
FROM node:14

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos da sua aplicação para o diretório de trabalho
COPY . .

# Instale as dependências
RUN npm install

# Defina a porta na qual a aplicação irá escutar
EXPOSE 3333

# Defina o comando para iniciar a aplicação
CMD [ "npm", "start" ]
