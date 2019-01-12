import request from "request";

// Handles messaging_postbacks events
export function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request.post(
    {
      uri: "https://graph.facebook.com/v3.2/me/messages",
      qs: { access_token: process.env.FB_ACCESS_TOKEN },
      json: request_body
    },
    (err, res, body) => {
      if (err) {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

// handles message events
export function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${
        received_message.text
      }". You can also send me an attachment if you want!`
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes"
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no"
                }
              ]
            }
          ]
        }
      }
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

export function forwardMessage(sender_psid, received_message) {
  let response;

  console.log(`Message received: ${received_message.text}`);

  request.post(
    {
      url: "https://pytorch-chatbot.herokuapp.com/prediction",
      body: { message: received_message.text },
      headers: { "User-Agent": "request" },
      json: true
    },
    (err, res, body) => {
      if (err) {
        console.error("Unable to send message:" + err);
      }

      // create the response message for the facebook messenger
      response = { text: `${res.body}` };
      console.log(`Answer: ${res.body}`);
    }
  );

  // Send the response message
  callSendAPI(sender_psid, response);
}
