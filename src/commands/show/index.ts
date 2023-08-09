import { SlashCommandBuilder } from "discord.js";
import moment from "moment";
import { calendar } from "../../calendar";
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
          await interaction.reply({
            embeds: calendar.list(guildID).map((e) => calendar.embed(e, e.id)),
          });
        } else {
          const e = calendar.event(id, guildID);
          if (e !== null) {
            await interaction.reply({ embeds: [calendar.embed(e, id)] });
          } else {
            await interaction.reply({
              content: `NO EXISTE EL EVENT CON ID ${id}`,
            });
          }
        }
      } else {
        const result = calendar
          .list(guildID)
          .filter((e) => e.data.day === moment().utcOffset(e.data.utc).day());
        if (result.length > 0) {
          await interaction.reply({
            embeds: result.map((e) => calendar.embed(e, e.id)),
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
