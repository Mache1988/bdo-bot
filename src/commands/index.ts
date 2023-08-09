import { Collection } from "discord.js";

import { command } from "./types";

import Add from "./add";
import Show from "./show";
import Remove from "./remove";

const commands = new Collection<string, command>();

commands.set(Add.data.name, Add);
commands.set(Show.data.name, Show);
commands.set(Remove.data.name, Remove);

export default commands;
