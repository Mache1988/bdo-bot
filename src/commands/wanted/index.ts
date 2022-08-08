import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../types";
import { BONUZ_COLOR, getWantedList, WANTED_COLOR } from "./api";

const random: command = {
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Replies with a random generated wanted list")
    .setDefaultMemberPermissions(0)
    .addIntegerOption((option) =>
      option
        .setName("from")
        .setDescription("First token_id in range (inclusive)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("to")
        .setDescription("Last token_id in range (inclusive)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("team")
        .setDescription("Quantity of targets")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("bonuz")
        .setDescription("Quantity of bonuz targets")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("offset")
        .setDescription("Positive offset of thread level")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction, extra) => {
    const _from = interaction.options.get("from")?.value as number;
    const _to = interaction.options.get("to")?.value as number;
    const _team = interaction.options.get("team")?.value as number;
    const _bonuz = interaction.options.get("bonuz")?.value as number;
    const _offset = interaction.options.get("offset")?.value as number;
    const black_list = [0, 1, 87, 22, 86];
    const header = new EmbedBuilder()
      .setColor(0xfc03ca)
      .setTitle("WANTED FINGERZ")
      .setDescription("MISSION GENERATOR (RANDOM PICKER)")
      .setImage("https://nftfingerz.xyz/static/media/wanted.8110b4f8.png")
      .addFields(
        {
          name: "First token_id in range (inclusive)",
          value: `#${_from}`,
        },
        {
          name: "Last token_id in range (inclusive)",
          value: `#${_to}`,
        },
        { name: "Quantity of targets", value: `${_team}` },
        {
          name: "Quantity of bonuz targets",
          value: `${_bonuz}`,
        },
        {
          name: "Positive offset of thread level",
          value: `${_offset}`,
        },
        {
          name: "Black listed",
          value: black_list.map((b) => `#${b}`).join(", "),
        }
      );
    await interaction.followUp("WORKING...");
    const wanted_header = new EmbedBuilder()
      .setColor(WANTED_COLOR)
      .setTitle("WANTED TARGETS");
    const bonuz_header = new EmbedBuilder()
      .setColor(BONUZ_COLOR)
      .setTitle("BONUZ TARGETS");

    try {
      await interaction.reply({ embeds: [header] });
      if (extra) {
        const embeds = await getWantedList(
          interaction,
          extra,
          { _from, _to, _team, _bonuz, _offset },
          black_list
        );
        await interaction.followUp({
          embeds: [wanted_header].concat(embeds.wanted_embeds),
        });
        if (embeds.bonuz_embeds.length > 1) {
          await interaction.followUp({
            embeds: [bonuz_header].concat(embeds.bonuz_embeds),
          });
        }

        await interaction.followUp("READY");
      }
    } catch (error) {
      console.log(error);
      interaction.followUp(`Error: ${JSON.stringify(error)}`);
    }
  },
};
export default random;
