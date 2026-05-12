FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=https://accomplished-contentment-production-35bb.up.railway.app/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-p", "3000"]
