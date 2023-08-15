import { SlashCommandBuilder } from "discord.js";
import moment from "moment";
import { calendar } from "../../calendar";
import formatTime from "../../calendar/formatTime";
import { command } from "../types";

const Show: command = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription(
      "Si se provee ID muestra los datos especificos del evento caso contrario muestra todos los eventos"
    )
    .setDefaultMemberPermissions(0)
    .addStringOption((options) =>
      options
        .setName("id")
        .setDescription(
          "ID del evento.Si se omite muestra los eventos del dia. Para mostrar todos: all"
        )
    ),
  execute: async (interaction) => {
    try {
      const id = interaction.options.get("id", false)?.value as
        | string
        | undefined;
      const guildID = interaction.guildId as string;
      if (id !== undefined) {
        if (id === "all") {
          const allEvents = calendar.list(guildID);
          if (allEvents.length > 0) {
            await interaction.reply({
              embeds: allEvents.map((e) => calendar.embed(e, e.id)),
            });
          } else {
            await interaction.reply({
              content: `NO HAY EVENTOS`,
            });
          }
        } else {
          const e = calendar.event(id, guildID);
          if (e !== null) {
            const dia = moment
              .unix(e.notificateAt)
              .utcOffset(e.data.utc)
              .format("dddd D")
              .toUpperCase();
            const hora = formatTime(e.data.hour - 1, e.data.utc);

            await interaction.reply({ embeds: [calendar.embed(e, id)] });
            await interaction.followUp({
              content: `# PROXIMA NOTIFICACIÓN\r## ${dia}\r${hora}`,
            });
          } else {
            await interaction.reply({
              content: `NO EXISTE EL EVENT CON ID ${id}`,
            });
          }
        }
      } else {
        const todayEvents = calendar
          .list(guildID)
          .filter((e) => e.data.day === moment().utcOffset(e.data.utc).day());
        if (todayEvents.length > 0) {
          await interaction.reply({
            embeds: todayEvents.map((e) => calendar.embed(e, e.id)),
          });
        } else {
          await interaction.reply({
            content: `NO HAY EVENTOS PARA HOY`,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
export default Show;
