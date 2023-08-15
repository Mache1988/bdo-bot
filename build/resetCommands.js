"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
require("dotenv/config");
const rest = new rest_1.REST( /*{ version: "10" }*/).setToken(process.env.TOKEN);
rest
    .put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
    body: [],
})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
//# sourceMappingURL=resetCommands.js.map