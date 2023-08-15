"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("moment/locale/es");
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
const formatTime_1 = __importDefault(require("./formatTime"));
const types_1 = require("./types");
moment_1.default.locale("es");
const DEFAULT_IMAGE = "https://s1.pearlcdn.com/NAEU/Upload/WALLPAPER/80443869fe120221026113658506.jpg";
const CustomizeEmbed = (e, id, footer) => {
    const counters = {
        frontLine: 1,
        backLine: 1,
        defense: 1,
        flank: 1,
        bomb: 1,
        cannon: 1,
        reject: 1,
        unknown: 1,
    };
    const formatPlayer = (key) => {
        const stringify = Object.values(e.members)
            .filter((m) => m.assistance === key)
            .map((u) => {
            const { prefix } = e;
            let userClass = "?";
            if (prefix) {
                const role = u.roles.find((r) => r.name.includes(prefix)) || null;
                if (role) {
                    userClass = role.name.slice(prefix.length).toUpperCase();
                }
            }
            return `#${counters[key]++} - ${(0, discord_js_1.userMention)(u.user.id)} [**${userClass}**]`;
        })
            .join("\r");
        return stringify || "NONE";
    };
    const roles = {
        frontLine: formatPlayer("frontLine"),
        backLine: formatPlayer("backLine"),
        flank: formatPlayer("flank"),
        defense: formatPlayer("defense"),
        bomb: formatPlayer("bomb"),
        cannon: formatPlayer("cannon"),
        reject: formatPlayer("reject"),
        unknown: formatPlayer("unknown"),
    };
    const assistance = Object.entries(roles).map(([rol, value]) => ({
        name: (0, discord_js_1.underscore)(rol.toUpperCase()),
        value,
        inline: true,
    }));
    const message = new discord_js_1.EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(e.data.name)
        .setAuthor({
        name: e.guild.name,
        iconURL: e.guild.iconURL || undefined,
    })
        .setThumbnail(e.guild.iconURL || null)
        .setDescription("Lista de participación para la node, favor de responder responsablemente.")
        .addFields({ name: (0, discord_js_1.underscore)("#ID"), value: id, inline: true }, {
        name: (0, discord_js_1.underscore)("PARTICIPA"),
        value: `@${e.roleToNotify.name}`,
        inline: true,
    }, { name: (0, discord_js_1.underscore)("PREFIX"), value: e.prefix || "?", inline: true })
        .addFields({ name: (0, discord_js_1.underscore)("SERVER"), value: e.data.server, inline: true }, {
        name: (0, discord_js_1.underscore)("DIA"),
        value: types_1.WEEK.at(e.data.day) || "",
        inline: true,
    }, {
        name: (0, discord_js_1.underscore)("REPITE"),
        value: e.data.repeat ? "SEMANAL" : "NO",
        inline: true,
    })
        .addFields({
        name: (0, discord_js_1.underscore)("HORA"),
        value: (0, formatTime_1.default)(e.data.hour, e.data.utc),
    })
        .addFields({ name: "\u200B", value: "\u200B" })
        .addFields(assistance)
        .setImage(e.data.image || DEFAULT_IMAGE)
        .setURL(e.data.link || null)
        .setTimestamp()
        .setFooter(footer ? { text: footer } : null);
    return message;
};
exports.default = CustomizeEmbed;
//# sourceMappingURL=customizeEmbed.js.map