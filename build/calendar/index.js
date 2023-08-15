"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendar = void 0;
require("dotenv/config");
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
const events_1 = __importDefault(require("../events"));
const mongodb_1 = require("../db/mongodb");
const customizeEmbed_1 = __importDefault(require("./customizeEmbed"));
const types_1 = require("./types");
class CalendarBot {
    events = {};
    interval = 1000 * 60;
    unSuscribe = null;
    client = null;
    status = "off";
    updateInterval(interval) {
        this.interval = interval;
    }
    async addEvent(e) {
        const previousEvents = this.events;
        let id = null;
        do {
            id = Math.floor(Math.random() * (0, moment_1.default)().unix())
                .toString()
                .slice(0, 4);
        } while (Object.prototype.hasOwnProperty.call(this.events, id) ||
            id === null);
        const eventDate = (0, moment_1.default)()
            .utcOffset(e.data.utc)
            .day(e.data.day)
            .hour(e.data.hour - 1)
            .minute(0)
            .second(0)
            .unix();
        const event = {
            ...e,
            id,
            expired: false,
            notificateAt: eventDate,
            members: {},
        };
        try {
            const onInsert = await (await mongodb_1.MongoCx.events).insertOne(event);
            console.log(`[${onInsert.insertedId}] Inserted event with ID#${id}`);
            this.events = {
                ...previousEvents,
                [id]: { ...event, _id: onInsert.insertedId },
            };
            return { id, event: { ...event, _id: onInsert.insertedId }, error: null };
        }
        catch (error) {
            console.log(error.message);
            return { error: error.message, id: null, event: null };
        }
    }
    async removeEvent(id, guildID) {
        if (this.events[id] || this.events[id].guild.id === guildID) {
            try {
                const onDelete = await (await mongodb_1.MongoCx.events).deleteOne({ id });
                console.log(`[${onDelete.deletedCount}] Deleted event with ID#${id}`);
                delete this.events[id];
                return `[${onDelete.deletedCount}] Deleted event with ID#${id}`;
            }
            catch (error) {
                console.log(error.message);
                return error.message;
            }
        }
        else {
            return `Event ID#${id} doesn't exist`;
        }
    }
    async updateEvent(id, { _id, ...e }, guildID) {
        if (this.events[id] || this.events[id].guild.id === guildID) {
            try {
                const onUpdate = await (await mongodb_1.MongoCx.events).updateOne({ id }, { $set: e });
                console.log(`[${onUpdate.modifiedCount}] Updated event with ID#${id}`);
                const previousEvents = this.events;
                this.events = { ...previousEvents, [id]: { ...e, _id } };
            }
            catch (error) {
                console.log(error.message);
            }
        }
    }
    async init() {
        try {
            const client = new discord_js_1.Client({
                intents: [
                    discord_js_1.GatewayIntentBits.Guilds,
                    discord_js_1.GatewayIntentBits.GuildMembers,
                    discord_js_1.GatewayIntentBits.DirectMessages,
                ],
            });
            events_1.default.forEach((event) => {
                if (event.once) {
                    client.once(event.name, (interaction) => event.execute(interaction));
                }
                else {
                    client.on(event.name, (interaction) => event.execute(interaction));
                }
            });
            this.client = client;
            await client.login(process.env.TOKEN);
            this.start();
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async start() {
        try {
            const events = await (await mongodb_1.MongoCx.events).find({}).toArray();
            console.log(`[${events.length}] Events fetched`);
            if (events.length > 0) {
                this.events = events.reduce((prev, next) => {
                    return { ...prev, [next.id]: { ...next } };
                }, {});
            }
            this.status = "started";
            this.unSuscribe = setInterval(() => {
                console.log(`[${(0, moment_1.default)().format()}] Running rate: ${this.interval / 1000}S`);
                this.run();
            }, this.interval);
        }
        catch (error) {
            console.log(error.message);
        }
    }
    stop() {
        if (this.unSuscribe !== null) {
            clearInterval(this.unSuscribe);
        }
    }
    async run() {
        for (const id in this.events) {
            const e = this.events[id];
            const date = (0, moment_1.default)().utcOffset(e.data.utc).unix();
            const day = (0, moment_1.default)().utcOffset(e.data.utc).day();
            if (e.data.day === day) {
                /*console.log(`Current date: ${date} [${moment.unix(date).format()}]`);
                console.log(
                  `Notification date: ${e.notificateAt} [${moment
                    .unix(e.notificateAt)
                    .format()}]`
                );*/
                if (e.notificateAt <= date) {
                    const nextEvent = {
                        ...e,
                        members: {},
                        expired: !e.data.repeat,
                        notificateAt: e.notificateAt + 604800,
                    };
                    this.updateEvent(id, nextEvent, e.guild.id);
                    this.notifier(nextEvent, id);
                }
            }
        }
    }
    async flush(guildID) {
        let deletedCount = 0;
        const deletedID = [];
        for (const id in this.events) {
            if (this.events[id].guild.id === guildID && this.events[id].expired) {
                await this.removeEvent(id, guildID);
                deletedCount++;
                deletedID.push(id);
                delete this.events[id];
            }
        }
        return `[${deletedCount}] Deleted event with ID#${deletedID.join(", ")}`;
    }
    list(guildID) {
        return Object.values(this.events).filter((e) => e.guild.id === guildID);
    }
    event(id, guildID) {
        if (this.events[id] || this.events[id].guild.id === guildID) {
            return this.events[id];
        }
        else {
            return null;
        }
    }
    embed(e, id, footer) {
        return (0, customizeEmbed_1.default)(e, id, footer);
    }
    async notifier(e, id) {
        if (this.client === null) {
            throw new Error("Client null");
        }
        const guildCache = this.client.guilds.cache.find((g) => g.id === e.guild.id);
        if (guildCache === undefined) {
            throw new Error(`Guild ID#${e.guild.id} not found`);
        }
        const members = await guildCache.members.fetch();
        const rolesA = [
            { name: "frontLine", style: discord_js_1.ButtonStyle.Primary, icon: "⚔️" },
            { name: "backLine", style: discord_js_1.ButtonStyle.Primary, icon: "🏹" },
            { name: "flank", style: discord_js_1.ButtonStyle.Primary, icon: "🦄" },
        ].map((rol) => new discord_js_1.ButtonBuilder()
            .setCustomId(rol.name)
            .setLabel(rol.name.toUpperCase())
            .setStyle(rol.style)
            .setEmoji(rol.icon));
        const rolesB = [
            { name: "defense", style: discord_js_1.ButtonStyle.Primary, icon: "🛡️" },
            { name: "bomb", style: discord_js_1.ButtonStyle.Primary, icon: "💣" },
            { name: "cannon", style: discord_js_1.ButtonStyle.Primary, icon: "🎯" },
        ].map((rol) => new discord_js_1.ButtonBuilder()
            .setCustomId(rol.name)
            .setLabel(rol.name.toUpperCase())
            .setStyle(rol.style)
            .setEmoji(rol.icon));
        const options = [
            { name: "reject", style: discord_js_1.ButtonStyle.Danger, icon: "✖️" },
            { name: "unknown", style: discord_js_1.ButtonStyle.Secondary, icon: "❔" },
        ].map((rol) => new discord_js_1.ButtonBuilder()
            .setCustomId(rol.name)
            .setLabel(rol.name.toUpperCase())
            .setStyle(rol.style)
            .setEmoji(rol.icon));
        const firstRow = new discord_js_1.ActionRowBuilder().addComponents(rolesA);
        const secondRow = new discord_js_1.ActionRowBuilder().addComponents(rolesB);
        const thirdRow = new discord_js_1.ActionRowBuilder().addComponents(options);
        members.each(async (m) => {
            if (e.botID !== m.id) {
                const roles = m.roles.cache
                    .toJSON()
                    .map((r) => ({ name: r.name, id: r.id }));
                if (roles.find((r) => r.id === e.roleToNotify.id)) {
                    console.log(`NOTIFICATION SENT TO: ${m.displayName}`);
                    const message = await m.send({
                        embeds: [this.embed(e, id)],
                        components: [firstRow, secondRow, thirdRow],
                    });
                    try {
                        const response = await message.awaitMessageComponent({
                            time: 1_800_000,
                        });
                        this.updateEvent(id, {
                            ...e,
                            members: {
                                ...e.members,
                                [m.id]: {
                                    assistance: response.customId,
                                    user: m.user,
                                    roles,
                                },
                            },
                        }, e.guild.id);
                        response.update({
                            embeds: [
                                this.embed(e, id, `CHOISE: **${response.customId.toUpperCase()}**`),
                            ],
                            components: [],
                        });
                    }
                    catch (error) {
                        console.log(error.message);
                        this.updateEvent(id, {
                            ...e,
                            members: {
                                ...e.members,
                                [m.id]: {
                                    assistance: types_1.unknown,
                                    user: m.user,
                                    roles,
                                },
                            },
                        }, e.guild.id);
                        message.edit({
                            embeds: [
                                this.embed(e, id, `CHOISE: **${types_1.unknown.toUpperCase()}**`),
                            ],
                            components: [],
                        });
                    }
                }
            }
        });
    }
}
exports.calendar = new CalendarBot();
//# sourceMappingURL=index.js.map