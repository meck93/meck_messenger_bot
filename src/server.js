import "@babel/polyfill";

import express from "express";
import bodyParser from "body-parser";
import request from "request";
import cors from "cors";

// load node environment variables
require("dotenv").config();

const hostname = "0.0.0.0";
const port = process.env.PORT || 8080;

// create new express app
const app = express();

// basic config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Index route
app.get("/", (req, res) => {
  res.send("Hello world, I am a chat bot for facebook messenger.");
});

// for facebook verification
app.get("/webhook/", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.FB_URL_TOKEN) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong token");
});

function sendTextMessage(sender, text) {
  let messageData = { text: text };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.FB_ACCESS_TOKEN },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: messageData
      }
    },
    function(error, response, body) {
      if (error) {
        console.log("Error sending messages: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
}

app.post("/webhook/", (req, res) => {
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

// run server and listen for incoming requests
app.listen(port, () => {
  console.log(
    `Running stuff on http://${hostname}:${port}. NODE_ENV: ${
      process.env.NODE_ENV
    }.`
  );
});
