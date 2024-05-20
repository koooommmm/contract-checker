FROM node:21-bullseye
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-ipafont-gothic \
    && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
