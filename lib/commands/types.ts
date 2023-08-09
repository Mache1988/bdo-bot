import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export interface command {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: CommandInteraction) => Promise<void>; //InteractionResponse<boolean>
}
