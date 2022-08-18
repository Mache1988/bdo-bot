import { Collection } from "discord.js";
import Wanted from "./wanted";
import { command } from "./types";
import Holders from "./holders";
import Say from "./say";

const commands = new Collection<string, command>();
commands.set(Wanted.data.name, Wanted);
commands.set(Holders.data.name, Holders);
commands.set(Say.data.name, Say);

export default commands;
