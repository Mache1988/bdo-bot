import { Collection } from "discord.js";
import Wanted from "./wanted";
import { command } from "./types";
import Holders from "./holders";

const commands = new Collection<string, command>();
commands.set(Wanted.data.name, Wanted);
commands.set(Holders.data.name, Holders);

export default commands;
