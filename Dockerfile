FROM node:latest

ENV WORK_FOLDER='/usr/src/PokegoBot'

WORKDIR ${WORK_FOLDER}

COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY . ${WORK_FOLDER}

RUN npm install npm -g
RUN npm install
RUN npm install -g typescript
RUN npm run build
COPY . .

EXPOSE 3000

RUN npm run build