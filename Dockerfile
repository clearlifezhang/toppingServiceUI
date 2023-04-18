# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app source code into the container
COPY . .

# Build the React app using the environment variables
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Use a second stage with an Nginx server to serve the app
FROM nginx:1.21

# Copy the built app from the previous stage into the Nginx server's HTML folder
COPY --from=0 /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

## build command after configuring Nginx as a reverse proxy
# docker build --build-arg REACT_APP_API_BASE_URL=http://localhost:30000 -t topping-service-ui:latest .

## configure Nginx as a normal web server, not a reverse proxy
# docker build --build-arg REACT_APP_API_BASE_URL=http://localhost:30080 -t topping-service-ui:latest .

