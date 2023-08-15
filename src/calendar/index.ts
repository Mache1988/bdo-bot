import "dotenv/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GatewayIntentBits,
} from "discord.js";
import moment from "moment";
import events from "../events";
import { MongoCx } from "../db/mongodb";
import CustomizeEmbed from "./customizeEmbed";
import {
  CalendarEvents,
  CalendarEvent,
  WarRole,
  unknown,
  CalendarEventNoID,
} from "./types";

class CalendarBot {
  events: CalendarEvents = {};
  interval = 1000 * 60;
  unSuscribe: NodeJS.Timer | null = null;
  client: Client | null = null;
  status = "off";

  updateInterval(interval: number) {
    this.interval = interval;
  }

  async addEvent(
    e: Omit<CalendarEventNoID, "members" | "notificateAt" | "expired" | "id">
  ) {
    const previousEvents = this.events;
    let id = null;
    do {
      id = Math.floor(Math.random() * moment().unix())
        .toString()
        .slice(0, 4);
    } while (
      Object.prototype.hasOwnProperty.call(this.events, id) ||
      id === null
    );

    const eventDate = moment()
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
      const onInsert = await (await MongoCx.events).insertOne(event);
      console.log(`[${onInsert.insertedId}] Inserted event with ID#${id}`);
      this.events = {
        ...previousEvents,
        [id]: { ...event, _id: onInsert.insertedId },
      };

      return { id, event: { ...event, _id: onInsert.insertedId }, error: null };
    } catch (error) {
      console.log((error as Error).message);
      return { error: (error as Error).message, id: null, event: null };
    }
  }

  async removeEvent(id: string, guildID: string) {
    if (this.events[id] || this.events[id].guild.id === guildID) {
      try {
        const onDelete = await (await MongoCx.events).deleteOne({ id });
        console.log(`[${onDelete.deletedCount}] Deleted event with ID#${id}`);
        delete this.events[id];
        return `[${onDelete.deletedCount}] Deleted event with ID#${id}`;
      } catch (error) {
        console.log((error as Error).message);
        return (error as Error).message;
      }
    } else {
      return `Event ID#${id} doesn't exist`;
    }
  }

  async updateEvent(id: string, { _id, ...e }: CalendarEvent, guildID: string) {
    if (this.events[id] || this.events[id].guild.id === guildID) {
      try {
        const onUpdate = await (
          await MongoCx.events
        ).updateOne({ id }, { $set: e });
        console.log(`[${onUpdate.modifiedCount}] Updated event with ID#${id}`);
        const previousEvents = this.events;
        this.events = { ...previousEvents, [id]: { ...e, _id } };
      } catch (error) {
        console.log((error as Error).message);
      }
    }
  }
  async init() {
    try {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.DirectMessages,
        ],
      });
      events.forEach((event) => {
        if (event.once) {
          client.once(event.name, (interaction) => event.execute(interaction));
        } else {
          client.on(event.name, (interaction) => event.execute(interaction));
        }
      });
      this.client = client;
      await client.login(process.env.TOKEN);
      this.start();
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  async start() {
    try {
      const events = await (await MongoCx.events).find({}).toArray();
      console.log(`[${events.length}] Events fetched`);
      if (events.length > 0) {
        this.events = events.reduce((prev, next) => {
          return { ...prev, [next.id]: { ...next } };
        }, {} as CalendarEvents);
      }
      this.status = "started";
      this.unSuscribe = setInterval(() => {
        console.log(
          `[${moment().format()}] Running rate: ${this.interval / 1000}S`
        );
        this.run();
      }, this.interval);
    } catch (error) {
      console.log((error as Error).message);
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
      const date = moment().utcOffset(e.data.utc).unix();
      const day = moment().utcOffset(e.data.utc).day();
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
  async flush(guildID: string) {
    let deletedCount = 0;
    const deletedID: string[] = [];
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
  list(guildID: string) {
    return Object.values(this.events).filter((e) => e.guild.id === guildID);
  }
  event(id: string, guildID: string) {
    if (this.events[id] || this.events[id].guild.id === guildID) {
      return this.events[id];
    } else {
      return null;
    }
  }

  embed(e: CalendarEvent, id: string, footer?: string) {
    return CustomizeEmbed(e, id, footer);
  }

  async notifier(e: CalendarEvent, id: string) {
    if (this.client === null) {
      throw new Error("Client null");
    }
    const guildCache = this.client.guilds.cache.find(
      (g) => g.id === e.guild.id
    );
    if (guildCache === undefined) {
      throw new Error(`Guild ID#${e.guild.id} not found`);
    }
    const members = await guildCache.members.fetch();

    const rolesA = [
      { name: "frontLine", style: ButtonStyle.Primary, icon: "⚔️" },
      { name: "backLine", style: ButtonStyle.Primary, icon: "🏹" },
      { name: "flank", style: ButtonStyle.Primary, icon: "🦄" },
    ].map((rol) =>
      new ButtonBuilder()
        .setCustomId(rol.name)
        .setLabel(rol.name.toUpperCase())
        .setStyle(rol.style)
        .setEmoji(rol.icon)
    );
    const rolesB = [
      { name: "defense", style: ButtonStyle.Primary, icon: "🛡️" },
      { name: "bomb", style: ButtonStyle.Primary, icon: "💣" },
      { name: "cannon", style: ButtonStyle.Primary, icon: "🎯" },
    ].map((rol) =>
      new ButtonBuilder()
        .setCustomId(rol.name)
        .setLabel(rol.name.toUpperCase())
        .setStyle(rol.style)
        .setEmoji(rol.icon)
    );
    const options = [
      { name: "reject", style: ButtonStyle.Danger, icon: "✖️" },
      { name: "unknown", style: ButtonStyle.Secondary, icon: "❔" },
    ].map((rol) =>
      new ButtonBuilder()
        .setCustomId(rol.name)
        .setLabel(rol.name.toUpperCase())
        .setStyle(rol.style)
        .setEmoji(rol.icon)
    );

    const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      rolesA
    );
    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      rolesB
    );
    const thirdRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      options
    );
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
            this.updateEvent(
              id,
              {
                ...e,
                members: {
                  ...e.members,
                  [m.id]: {
                    assistance: response.customId as WarRole,
                    user: m.user,
                    roles,
                  },
                },
              },
              e.guild.id
            );

            response.update({
              embeds: [
                this.embed(
                  e,
                  id,
                  `CHOISE: **${response.customId.toUpperCase()}**`
                ),
              ],
              components: [],
            });
          } catch (error) {
            console.log((error as Error).message);
            this.updateEvent(
              id,
              {
                ...e,
                members: {
                  ...e.members,
                  [m.id]: {
                    assistance: unknown,
                    user: m.user,
                    roles,
                  },
                },
              },
              e.guild.id
            );

            message.edit({
              embeds: [
                this.embed(e, id, `CHOISE: **${unknown.toUpperCase()}**`),
              ],
              components: [],
            });
          }
        }
      }
    });
  }
}

export const calendar = new CalendarBot();
