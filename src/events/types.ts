import { ChatInputCommandInteraction } from "discord.js";

export interface event {
  name: string;
  once: boolean;
  execute: (interacetion: ChatInputCommandInteraction) => void;
}
