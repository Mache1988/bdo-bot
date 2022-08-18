import { Interaction } from "discord.js";
import { t_extra } from "../api/types";

export interface event {
  name: string;
  once: boolean;
  execute: (interacetion: Interaction, extra?: t_extra) => void;
}
