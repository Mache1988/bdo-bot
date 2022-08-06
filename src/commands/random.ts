import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { queryIPFS } from "../api/contract";
import { command } from "./types";

const random: command = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Replies with random number in the range")
    .setDefaultMemberPermissions(0)
    .addIntegerOption((option) =>
      option.setName("from").setDescription("From inclusive").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("to").setDescription("To inclusive").setRequired(true)
    ),
  execute: async (interaction: CommandInteraction, fa2_storage) => {
    await interaction.deferReply();
    const _from = interaction.options.get("from")?.value as number;
    const _to = interaction.options.get("to")?.value as number;
    const result = Math.floor(Math.random() * (_to - _from + 1)) + _from;
    let wanted_uri = "";
    if (fa2_storage) {
      wanted_uri = await queryIPFS(fa2_storage, result);
    }
    const random_embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("WANTED FINGERZ")

      .setDescription("Mission generator")
      .setThumbnail("https://nftfingerz.xyz/static/media/wanted.8110b4f8.png")
      .addFields(
        { name: "From token ID", value: `#${_from}` },
        { name: "To token ID", value: `#${_to}` },
        { name: "Wanted token ID", value: `#${result}`, inline: true }
      )
      .setImage(wanted_uri)
      .setTimestamp();
    //`Random Number Rolled\nFrom: ${_from} (Inclusive)\nTo: ${_to} (Inclusive)\nResult: ${result}`
    await interaction.editReply({ embeds: [random_embed] });
  },
};
export default random;
