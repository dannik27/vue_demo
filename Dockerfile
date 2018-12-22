FROM node:latest

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

COPY back/package*.json ./back/
RUN npm --prefix back install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN npm run build-express

EXPOSE 8080
CMD [ "node", "back/server" ]