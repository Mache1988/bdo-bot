import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import "dotenv/config";
import commands from "./commands";

const rest = new REST(/*{ version: "10" }*/).setToken(
  process.env.TOKEN as string
);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
    body: commands.mapValues((value) => value.data.toJSON()),
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
