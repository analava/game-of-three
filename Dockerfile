# GAME SERVICE
FROM node:10
USER root
WORKDIR /var/app
COPY package*.json /var/app/
RUN npm i
COPY . /var/app/
EXPOSE 3000
CMD npm start