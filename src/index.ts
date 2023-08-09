import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { calendar } from "./calendar";
import events from "./events";

const start = async () => {
  try {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
      ],
    });
    events.forEach((event) => {
      if (event.once) {
        client.once(event.name, (interaction) => event.execute(interaction));
      } else {
        client.on(event.name, (interaction) => event.execute(interaction));
      }
    });
    client.login(process.env.TOKEN);
    calendar.start(client);
  } catch (error) {
    console.log(error);
  }
};
// Create a new client instance
start();
