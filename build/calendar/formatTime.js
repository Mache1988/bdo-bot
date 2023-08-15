"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const formatTime = (hora, zona) => {
    const date = (0, moment_1.default)().hour(hora).utcOffset(zona);
    const timeAR = date.utcOffset(-3).hour();
    const timeCL = date.utcOffset(-4).hour();
    const timePE = date.utcOffset(-5).hour();
    const timeMX = date.utcOffset(-6).hour();
    return `ARGENTINA [UTC-03:00]: **${timeAR}:00**\rCHILE [UTC-04:00]: **${timeCL}:00**\rPERU [UTC-05:00]: **${timePE}:00**\rMEXICO [UTC-06:00]: **${timeMX}:00**`;
};
exports.default = formatTime;
//# sourceMappingURL=formatTime.js.map