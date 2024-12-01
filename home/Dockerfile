# Dockerfile

# Base image for serving static files
FROM nginx:latest

# Copy static game home page and assets
COPY index.html /usr/share/nginx/html/index.html
COPY sounds /usr/share/nginx/html/sounds

# Add the NGINX configuration to route to games
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
