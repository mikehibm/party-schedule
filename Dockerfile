FROM node:10

WORKDIR /home/node/app

COPY ./package.json /home/node/app/
RUN npm install

COPY . /home/node/app

EXPOSE 3000
# CMD [ "npm", "start" ]
CMD [ "/bin/sh" ]
