FROM node:carbon-slim

ENV PORT=5000
ENV SHOW_URLS=true
ENV SAP_PROFILE_MS_API_HOST="msprofile"
ENV SAP_PROFILE_MS_API_PORT=8000
ENV SAP_PROFILE_MS_API_ENTRY="api/User/"
ENV SAP_AMIGOS_MS_API_HOST=""
ENV SAP_AMIGOS_MS_API_PORT=5000
ENV SAP_AMIGOS_MS_API_ENTRY="amigos"
ENV SAP_CANVAS_MS_API_HOST=""
ENV SAP_CANVAS_MS_API_PORT=3000
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

EXPOSE 5000