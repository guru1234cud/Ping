FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG VITE_BE_URL
ARG VITE_BASE_URL
ENV VITE_BE_URL=$VITE_BE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]