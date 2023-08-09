import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import "dotenv/config";

const rest = new REST(/*{ version: "10" }*/).setToken(
  process.env.TOKEN as string
);

rest
  .delete(
    Routes.applicationCommand(
      process.env.CLIENT_ID as string,
      "1005251837273833482"
    )
  )
  .then(() => console.log("Successfully deleted application commands."))
  .catch(console.error);
