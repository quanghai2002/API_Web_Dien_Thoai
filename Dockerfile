FROM node:18-alpine
WORKDIR /app


COPY package*.json ./

# ENV SERVER_ADDRESS=nguyenquanghai.online
# ENV POST=443

RUN npm install 
RUN npm install -g nodemon

COPY . .


CMD ["npm", "start"]


# docker build --tag backend-nodejs .

# docker run -dp 443:443 backend-nodejs
# docker run -dp 80:80 backend-nodejs
