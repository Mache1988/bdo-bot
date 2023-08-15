import { Collection } from "discord.js";
import onInteractionCreate from "./interactionCreate";
import onReady from "./ready";
import { event } from "./types";

const events = new Collection<string, event>();
events.set(onReady.name, onReady);
events.set(onInteractionCreate.name, onInteractionCreate);

export default events;
