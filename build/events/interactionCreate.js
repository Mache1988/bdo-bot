"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = __importDefault(require("../commands"));
const onInteractionCreate = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = commands_1.default.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
exports.default = onInteractionCreate;
//# sourceMappingURL=interactionCreate.js.map