FROM node:6.9
WORKDIR /opt/bot/emotion_bot
COPY server.js /opt/bot/emotion_bot/server.js
COPY .env /opt/bot/emotion_bot/.env
COPY routes /opt/bot/emotion_bot/routes
COPY internal_modules /opt/bot/emotion_bot/internal_modules
COPY package.json /opt/bot/emotion_bot/package.json
RUN npm install
# VOLUME ["/opt/bot/emotion_bot/.env"]
EXPOSE 8080
CMD ["node","server.js","--env","NODE_ENV=prod"]
