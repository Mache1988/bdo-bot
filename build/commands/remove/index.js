"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const calendar_1 = require("../../calendar");
const Remove = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remueve eventos finalizados")
        .setDefaultMemberPermissions(0)
        .addStringOption((options) => options.setName("id").setDescription("ID del evento")),
    execute: async (interaction) => {
        try {
            const id = interaction.options.get("id", false)?.value;
            const guildID = interaction.guildId;
            if (id !== undefined) {
                const result = await calendar_1.calendar.removeEvent(id, guildID);
                await interaction.reply({
                    content: result,
                });
            }
            else {
                const result = await calendar_1.calendar.flush(guildID);
                await interaction.reply({
                    content: result,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    },
};
exports.default = Remove;
//# sourceMappingURL=index.js.map