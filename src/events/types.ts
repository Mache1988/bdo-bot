import { CommandInteraction } from "discord.js";
import { t_fa2_storage } from "../api/types";

export interface event {
  name: string;
  once: boolean;
  execute: (
    interacetion: CommandInteraction,
    fa2_storage?: t_fa2_storage | null
  ) => void;
}
