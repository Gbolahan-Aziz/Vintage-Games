# Dockerfile

# Base image for serving static files
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY games     /usr/share/nginx/html/games
COPY sounds    /usr/share/nginx/html/sounds
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
