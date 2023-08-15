"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
const calendar_1 = require("../../calendar");
const formatTime_1 = __importDefault(require("../../calendar/formatTime"));
const Show = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("show")
        .setDescription("Si se provee ID muestra los datos especificos del evento caso contrario muestra todos los eventos")
        .setDefaultMemberPermissions(0)
        .addStringOption((options) => options
        .setName("id")
        .setDescription("ID del evento.Si se omite muestra los eventos del dia. Para mostrar todos: all")),
    execute: async (interaction) => {
        console.log(JSON.stringify(typeof interaction));
        try {
            const id = interaction.options.get("id", false)?.value;
            const guildID = interaction.guildId;
            if (id !== undefined) {
                if (id === "all") {
                    const allEvents = calendar_1.calendar.list(guildID);
                    if (allEvents.length > 0) {
                        await interaction.reply({
                            embeds: allEvents.map((e) => calendar_1.calendar.embed(e, e.id)),
                        });
                    }
                    else {
                        await interaction.reply({
                            content: `NO HAY EVENTOS`,
                        });
                    }
                }
                else {
                    const e = calendar_1.calendar.event(id, guildID);
                    if (e !== null) {
                        const dia = moment_1.default
                            .unix(e.notificateAt)
                            .utcOffset(e.data.utc)
                            .format("dddd D")
                            .toUpperCase();
                        const hora = (0, formatTime_1.default)(e.data.hour - 1, e.data.utc);
                        await interaction.reply({ embeds: [calendar_1.calendar.embed(e, id)] });
                        await interaction.followUp({
                            content: `# PROXIMA NOTIFICACIÓN\r## ${dia}\r${hora}`,
                        });
                    }
                    else {
                        await interaction.reply({
                            content: `NO EXISTE EL EVENT CON ID ${id}`,
                        });
                    }
                }
            }
            else {
                const todayEvents = calendar_1.calendar
                    .list(guildID)
                    .filter((e) => e.data.day === (0, moment_1.default)().utcOffset(e.data.utc).day());
                if (todayEvents.length > 0) {
                    await interaction.reply({
                        embeds: todayEvents.map((e) => calendar_1.calendar.embed(e, e.id)),
                    });
                }
                else {
                    await interaction.reply({
                        content: `NO HAY EVENTOS PARA HOY`,
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    },
};
exports.default = Show;
//# sourceMappingURL=index.js.map