"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const calendar_1 = require("../../calendar");
const Add = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("add")
        .setDescription("Programar evento")
        .setDefaultMemberPermissions(0)
        .addNumberOption((option) => option
        .setName("day")
        .setDescription("Dia a realizar el evento")
        .setRequired(true)
        .addChoices({ name: "DOMINGO", value: 0 }, { name: "LUNES", value: 1 }, { name: "MARTES", value: 2 }, { name: "MIERCOLES", value: 3 }, { name: "JUEVES", value: 4 }, { name: "VIERNES", value: 5 }, { name: "SABADO", value: 6 })
        .setMaxValue(6)
        .setMinValue(0))
        .addNumberOption((option) => option
        .setName("hour")
        .setDescription("Horario 0-23")
        .setRequired(true)
        .setMaxValue(23)
        .setMinValue(0))
        .addNumberOption((option) => option
        .setName("utc")
        .setDescription("Zona horaria de -12 a +14")
        .setRequired(true)
        .setMaxValue(14)
        .setMinValue(-12))
        .addBooleanOption((option) => option
        .setName("repeat")
        .setDescription("Repetir semanalmente")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("name")
        .setDescription("Nombre del evento")
        .setRequired(true))
        .addStringOption((options) => options
        .setName("server")
        .setDescription("Server donde se realizará el evento")
        .setRequired(true))
        .addRoleOption((option) => option
        .setName("role")
        .setDescription("Solo se notificará al rol asignado")
        .setRequired(true))
        .addStringOption((options) => options
        .setName("prefix")
        .setDescription("Prefix del rol para asignar la clase, ej: T1_"))
        .addStringOption((options) => options.setName("link").setDescription("Url información adicional"))
        .addStringOption((options) => options.setName("image").setDescription("Url imagen/folleto promocional")),
    execute: async (interaction) => {
        const day = interaction.options.get("day", true).value;
        const hour = interaction.options.get("hour", true).value;
        const utc = interaction.options.get("utc", true).value;
        const repeat = interaction.options.get("repeat", true).value;
        const name = interaction.options.get("name", true).value;
        const server = interaction.options.get("server", true).value;
        const role = interaction.options.get("role", true).value;
        const prefix = interaction.options.get("prefix", false)?.value;
        const link = interaction.options.get("link", false)?.value;
        const image = interaction.options.get("image", false)?.value;
        try {
            if (interaction.guild) {
                const roleResult = (await interaction.guild.roles.fetch(role));
                const roleToNotify = {
                    name: roleResult.name,
                    id: role,
                };
                const bot = await interaction.guild.members.fetchMe();
                const guild = {
                    id: interaction.guild.id,
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL(),
                };
                const { id, event, error } = await calendar_1.calendar.addEvent({
                    data: {
                        day,
                        hour,
                        utc,
                        repeat,
                        name,
                        server,
                        link,
                        image,
                    },
                    guild,
                    roleToNotify,
                    botID: bot.id,
                    prefix,
                });
                if (event !== null && id !== null) {
                    await interaction.reply({ embeds: [calendar_1.calendar.embed(event, id)] });
                }
                else {
                    throw new Error(error);
                }
            }
            else {
                throw new Error("Fetching Guild Error");
            }
        }
        catch (error) {
            console.log(error.message);
            await interaction.reply(`FAIL : ${error.message}`);
        }
    },
};
exports.default = Add;
//# sourceMappingURL=index.js.map