FROM node:10-slim

WORKDIR /home/node/app

COPY ./package.json /home/node/app/
RUN npm install

COPY . /home/node/app

EXPOSE 3000 3200
# CMD [ "npm", "start" ]
CMD [ "/bin/sh" ]
