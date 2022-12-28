FROM node

RUN mkdir -p /var/www/the-wall

WORKDIR /var/www/the-wall

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

# ---- more info:
# Debugger with docker: https://dev.to/alex_barashkov/how-to-debug-nodejs-in-a-docker-container-bhi