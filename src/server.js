import "@babel/polyfill";

import express from "express";
import bodyParser from "body-parser";
import request from "request";
import cors from "cors";

// load node environment variables
require("dotenv").config();

const hostname = "0.0.0.0";
const port = process.env.PORT || 6006;

// create new express app
const app = express();

// basic config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

// Index route
app.get("/", function(req, res) {
  res.send("Hello world, I am a chat bot");
});

// for facebook verification
app.get("/webhook/", function(req, res) {
  if (req.query["hub.verify_token"] === process.env.FB_URL_TOKEN) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong token");
});

// run server and listen for incoming requests
app.listen(port, () => {
  console.log(
    `Running stuff on http://${hostname}:${port}. 
     NODE_ENV: ${process.env.NODE_ENV}.`
  );
});
