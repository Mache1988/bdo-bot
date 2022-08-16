import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../types";
import { getHolders } from "./api";

const Holders: command = {
  data: new SlashCommandBuilder()
    .setName("holders")
    .setDescription("Replies with a holder's list")
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
    .addBooleanOption((option) =>
      option
        .setName("dev")
        .setDescription("Return JSON for Mint coins in Dapp tool")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction, extra) => {
    const _from = interaction.options.get("from")?.value as number;
    const _to = interaction.options.get("to")?.value as number;
    const _dev = interaction.options.get("dev")?.value as boolean;

    try {
      //let response: string[] = [];
      let embeds_response: EmbedBuilder[][] = [];
      let ephemeral_response = "";
      await interaction.deferReply();
      if (extra) {
        const holders_list = await getHolders(extra, { _from, _to });
        //console.log(holders_list);
        ephemeral_response = JSON.stringify(holders_list);
        const in_order = Object.keys(holders_list)
          .map((address) => ({
            address,
            ...holders_list[address],
          }))
          .sort((holder_a, holder_b) => holder_b.total - holder_a.total);
        /*const pagination: string[] = [];
        let page = "";
        in_order.forEach(({ address, total, token_ids, alias }, rank) => {
          const to_add = `RANK #${
            rank + 1
          } - ADRRESS: ${address} (${alias})\nTOKENS #: ${token_ids.join(
            ", "
          )} [${total}] \n\n`;
          if (page.length + to_add.length >= 2000) {
            pagination.push(page);
            page = to_add;
          } else {
            page += to_add;
          }
        });
        pagination.push(page);*/
        const pagination: EmbedBuilder[][] = [];
        const embeds = in_order.map(
          ({ address, total, token_ids, alias }, rank) => {
            return new EmbedBuilder()
              .setColor(0xa83287)
              .setTitle(`RANK #${rank + 1}`)
              .setDescription(
                `WALLET: ${address} [${alias}]\nTOKEN/S: ${token_ids
                  .map((t) => `#${t}`)
                  .join(", ")}\nTOTAL: ${total} \n\n`
              );
            /*.setFields([
                  { name: "WALLET", value: address },
                  { name: "ALIAS", value: alias },
                  {
                    name: "TOKEN/S",
                    value: token_ids.map((t) => `#${t}`).join(", "),
                  },
                  {
                    name: "TOTAL",
                    value: `${total}`,
                  },
                ])*/
          }
        );
        while (embeds.length >= 10) {
          pagination.push(embeds.splice(0, 9));
        }
        pagination.push(embeds);
        embeds_response = pagination;
        //response = pagination;
      }
      const head = embeds_response.shift();
      await interaction.editReply({ embeds: head });
      //console.log(response);
      //await Promise.all(response.map((page) => interaction.followUp(page)));
      await Promise.all(
        embeds_response.map((embeds) => interaction.followUp({ embeds }))
      );

      if (_dev) {
        await interaction.followUp({
          content: ephemeral_response,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      interaction.followUp(`Error: ${JSON.stringify(error)}`);
    }
  },
};
export default Holders;
