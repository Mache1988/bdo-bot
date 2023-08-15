"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onReady = {
    name: "ready",
    once: true,
    execute: (interaction) => {
        console.log(`Ready! Logged in as ${interaction.user?.tag}`);
    },
};
exports.default = onReady;
//# sourceMappingURL=ready.js.map