# --- Stage 1: Build the React App ---
# UPDATED this line to use Node.js version 20
FROM node:20-alpine AS build

WORKDIR /app
# Use package*.json to copy both package.json and package-lock.json
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve the App with Nginx ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]