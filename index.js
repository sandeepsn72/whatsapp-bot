const qrcode = require("qrcode-terminal");
require("dotenv").config();
const OpenAI = require("openai");

const { Client } = require("whatsapp-web.js");
const { sleep } = require("openai/core");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

openAiToken = process.env.openAiToken;
const openai = new OpenAI({
  apiKey: openAiToken, // This is also the default, can be omitted
});

client.on("message", async (message) => {
  console.log(message.body, "FROM", message.from);
  try {
    // if ("fuck" in message.body.toLowerCase()) {
    //   message.reply("Fuck you too buddy!");
    // }
    const r = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message.body }],
    });
    message.reply(r.choices[0].message.content);
  } catch (err) {
    setTimeout(async () => {
      const r = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message.body }],
      });
      message.reply(r.choices[0].message.content);
    }, 60000);
  }
});

client.initialize();
