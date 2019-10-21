FROM node:12.10.0-alpine
# WORKDIR specifies the directory our
# application's code will live within
WORKDIR /app
# We copy our package.json file to our
# app directory
COPY package.json /app
# We then run npm install to install
# express for our application
RUN npm install
# We then copy the rest of our application
# to the app direcoty
COPY . /app
# Expose port 4000 
EXPOSE 4000
# Compile typescript
RUN npx tsc
# Run servers
CMD ["npm", "start"]