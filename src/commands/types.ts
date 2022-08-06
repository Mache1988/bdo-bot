import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { t_fa2_storage } from "../api/types";

export interface command {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    interaction: CommandInteraction,
    fa2_storage?: t_fa2_storage | null
  ) => Promise<void>; //InteractionResponse<boolean>
}
