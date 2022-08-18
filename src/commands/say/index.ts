import {
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "../types";

const Say: command = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Replies with a dessired speach")
    .setDefaultMemberPermissions(0)
    .addChannelOption((option) =>
      option
        .setName("destination")
        .setDescription("Where you want to speak")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("speach").setDescription("The speach").setRequired(true)
    ),
  execute: async (interaction) => {
    const destination = (
      interaction.options as CommandInteractionOptionResolver
    ).getChannel("destination", true).id;
    const speach = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("speach", true);
    try {
      const channel = (await interaction.client.channels.fetch(
        destination
      )) as TextChannel;
      await channel.send(speach);
      await interaction.reply(`Sent: ${speach} to channel: ${channel.name}`);
    } catch (error) {
      console.log(error);
      //interaction.followUp(`Error: ${JSON.stringify(error)}`);
    }
  },
};
export default Say;
