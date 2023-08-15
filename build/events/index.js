"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const interactionCreate_1 = __importDefault(require("./interactionCreate"));
const ready_1 = __importDefault(require("./ready"));
const events = new discord_js_1.Collection();
events.set(ready_1.default.name, ready_1.default);
events.set(interactionCreate_1.default.name, interactionCreate_1.default);
exports.default = events;
//# sourceMappingURL=index.js.map