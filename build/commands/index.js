"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const add_1 = __importDefault(require("./add"));
const show_1 = __importDefault(require("./show"));
const remove_1 = __importDefault(require("./remove"));
const commands = new discord_js_1.Collection();
commands.set(add_1.default.data.name, add_1.default);
commands.set(show_1.default.data.name, show_1.default);
commands.set(remove_1.default.data.name, remove_1.default);
exports.default = commands;
//# sourceMappingURL=index.js.map