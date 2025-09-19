FROM node:18-alpine AS build
WORKDIR /app
COPY euro-denomination-calculator/frontend/euro-denomination-frontend/package*.json ./
RUN npm install
COPY euro-denomination-calculator/frontend/euro-denomination-frontend/ ./
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/euro-denomination-frontend/browser /usr/share/nginx/html
COPY euro-denomination-calculator/frontend/euro-denomination-frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
