FROM node:18-alpine
WORKDIR /app


COPY package*.json ./

RUN npm install 
RUN npm install -g nodemon


COPY . .

CMD ["npm", "start"]


# docker build --tag backend-nodejs .

# docker run -dp 8080:8080 backend-nodejs
