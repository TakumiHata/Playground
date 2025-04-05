FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

RUN npm run build

# Copy icon files to build directory
RUN cp public/favicon.ico public/logo192.png public/logo512.png build/

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["npm", "start"] 