import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { getFA2Storage, getSalezStorage, tezosStart } from "./api/contract";
import events from "./events";

const start = async () => {
  try {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const tezos = tezosStart();
    const fa2_storage = await getFA2Storage(tezos);
    const salez_storage = await getSalezStorage(tezos);
    // When the client is ready, run this code (only once)
    const extra = { fa2_storage, salez_storage };
    events.forEach((event) => {
      if (event.once) {
        client.once(event.name, (interaction) => event.execute(interaction));
      } else {
        client.on(event.name, (interaction) =>
          event.execute(interaction, extra)
        );
      }
    });

    // Login to Discord with your client's token
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
};
// Create a new client instance
start();
