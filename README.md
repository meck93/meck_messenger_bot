# Meck Messenger Chatbot

A node.js server app which interacts with my personal Facebook Page and it's messenger app.

## Facebook for Developers

Only enable **messages** and **message_postbacks** otherwise the webhook endpoint will be called multiple times for the same question/answer interatction (e.g., because of a message_read, message_echo or message_delivery event).
