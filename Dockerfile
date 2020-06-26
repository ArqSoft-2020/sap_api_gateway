FROM node:carbon-slim

ENV PORT=5001
ENV SHOW_URLS=true
ENV SAP_PROFILE_MS_API_HOST="sapprofilems"
ENV SAP_PROFILE_MS_API_PORT=8000
ENV SAP_PROFILE_MS_API_ENTRY="api/User/"
ENV SAP_AMIGOS_MS_API_HOST="sapamigosms"
ENV SAP_AMIGOS_MS_API_PORT=5000
ENV SAP_AMIGOS_MS_API_ENTRY="amigos"
ENV SAP_CANVAS_MS_API_HOST="sapcanvasms"
ENV SAP_CANVAS_MS_API_PORT=3001
ENV SAP_CANVAS_MS_API_ENTRY="api/canvas/"


# Create app directory
WORKDIR /sap_api_gateway

# Install app dependencies
COPY package.json /sap_api_gateway/
RUN npm install

# Bundle app source
COPY . /sap_api_gateway/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]

EXPOSE 5001