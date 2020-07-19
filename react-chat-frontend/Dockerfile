FROM node:10.19.0

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 9000

CMD ["npm" , "start"]


