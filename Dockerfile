# stage: 1
FROM node:12 as react-build
WORKDIR /app
COPY ./client ./

RUN yarn
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
COPY — from=react-build build/ /usr/share/
EXPOSE 80
CMD [“nginx”, “-g”, “daemon off;”]