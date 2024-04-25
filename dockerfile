FROM nginx:latest

COPY front-end-MVP-3-PUC-Rio/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]