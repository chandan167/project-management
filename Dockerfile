FROM node:16-alpine
WORKDIR /app
COPY package.json ./

ARG NODE_ENV
ARG PORT

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./
EXPOSE $PORT

CMD [ "node", "dist/main.js" ];
