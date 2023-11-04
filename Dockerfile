FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install 
COPY . .
CMD ["npm", "start"]
# EXPOSE 3000

# docker build --tag backend-nodejs .

# docker run -dp 8080:8080 backend-nodejs
