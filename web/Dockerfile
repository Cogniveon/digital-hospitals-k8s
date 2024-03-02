# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

# Same as npm install
# RUN npm ci
RUN yarn install --frozen-lockfile

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "yarn", "dev" ]

FROM development AS build

RUN yarn build

###########################################################################################################################
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/nginx.conf /etc/nginx/templates/default.conf.template

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/dist .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]