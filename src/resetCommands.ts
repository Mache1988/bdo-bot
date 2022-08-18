import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import "dotenv/config";

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
    body: [],
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
