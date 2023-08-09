import { event } from "./types";

const onReady: event = {
  name: "ready",
  once: true,
  execute: (interaction) => {
    console.log(`Ready! Logged in as ${interaction.user?.tag}`);
  },
};

export default onReady;
