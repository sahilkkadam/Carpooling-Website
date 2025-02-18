const accountSid = "";
const authToken = "";

const client = require("twilio")(accountSid, authToken);

function sendTextMssgRider() {
  client.messages
    .create({
      to: "+15555555555",
      from: "+16203776593",
      body: "XYZ has booked a ride with you from abc to def",
    })
    .then((message) => console.log(`Message SID ${message.sid}`))
    .catch((error) => console.error(error));
}
