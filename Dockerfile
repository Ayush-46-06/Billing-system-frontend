# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage (Nginx)
FROM nginx:alpine
# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config to support React Router (SPA fallback to index.html)
RUN rm /etc/nginx/conf.d/default.conf && \
    echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
