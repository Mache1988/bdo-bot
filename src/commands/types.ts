import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { t_extra } from "../api/types";

export interface command {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: CommandInteraction, extra?: t_extra) => Promise<void>; //InteractionResponse<boolean>
}
