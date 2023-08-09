import { SlashCommandBuilder } from "discord.js";
import { calendar } from "../../calendar";
import { command } from "../types";

const Remove: command = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remueve eventos finalizados")
    .setDefaultMemberPermissions(0)
    .addStringOption((options) =>
      options.setName("id").setDescription("ID del evento")
    ),
  execute: async (interaction) => {
    try {
      const id = interaction.options.get("id", false)?.value as
        | string
        | undefined;
      const guildID = interaction.guildId as string;
      if (id !== undefined) {
        const result = await calendar.removeEvent(id, guildID);
        await interaction.reply({
          content: result,
        });
      } else {
        const result = await calendar.flush(guildID);
        await interaction.reply({
          content: result,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
export default Remove;
