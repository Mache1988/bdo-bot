import commands from "../commands";
import { event } from "./types";

const onInteractionCreate: event = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction, fa2_storage) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, fa2_storage);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};

export default onInteractionCreate;
