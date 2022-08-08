import { CommandInteraction } from "discord.js";
import { t_extra } from "../api/types";

export interface event {
  name: string;
  once: boolean;
  execute: (interacetion: CommandInteraction, extra?: t_extra) => void;
}
