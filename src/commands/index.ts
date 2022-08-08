import { Collection } from "discord.js";
import random from "./wanted";
import { command } from "./types";

const commands = new Collection<string, command>();
commands.set(random.data.name, random);

export default commands;
