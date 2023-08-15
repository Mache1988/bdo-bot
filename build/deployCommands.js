"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
require("dotenv/config");
const commands_1 = __importDefault(require("./commands"));
const rest = new rest_1.REST( /*{ version: "10" }*/).setToken(process.env.TOKEN);
rest
    .put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands_1.default.mapValues((value) => value.data.toJSON()),
})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
//# sourceMappingURL=deployCommands.js.map