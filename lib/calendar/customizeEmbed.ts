import {
  APIEmbedField,
  EmbedBuilder,
  underscore,
  userMention,
} from "discord.js";
import moment from "moment";
import formatTime from "./formatTime";
import { CalendarEvent, WarRole, WEEK } from "./types";
const DEFAULT_IMAGE =
  "https://s1.pearlcdn.com/NAEU/Upload/WALLPAPER/80443869fe120221026113658506.jpg";
const CustomizeEmbed = (e: CalendarEvent, id: string, footer?: string) => {
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

  const formatPlayer = (key: WarRole) => {
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

        return `#${counters[key]++} - ${userMention(
          u.user.id
        )} [**${userClass}**]`;
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

  const assistance: APIEmbedField[] = Object.entries(roles).map(
    ([rol, value]) => ({
      name: underscore(rol.toUpperCase()),
      value,
      inline: true,
    })
  );
  const message = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(e.data.name)
    .setAuthor({
      name: e.guild.name,
      iconURL: e.guild.iconURL || undefined,
    })
    .setThumbnail(e.guild.iconURL || null)
    .setDescription(
      "Lista de participación para la node, favor de responder responsablemente."
    )
    .addFields({
      name: underscore("NOTIFICA"),
      value: moment.unix(e.notificateAt).utcOffset(e.data.utc).format(),
    })
    .addFields({ name: "\r", value: "\r" })
    .addFields(
      { name: underscore("#ID"), value: id, inline: true },
      {
        name: underscore("PARTICIPA"),
        value: `@${e.roleToNotify.name}`,
        inline: true,
      },
      { name: underscore("PREFIX"), value: e.prefix || "?", inline: true }
    )
    .addFields(
      { name: underscore("SERVER"), value: e.data.server, inline: true },
      {
        name: underscore("DIA"),
        value: WEEK.at(e.data.day) || "",
        inline: true,
      },
      {
        name: underscore("REPITE"),
        value: e.data.repeat ? "SEMANAL" : "NO",
        inline: true,
      }
    )
    .addFields({
      name: underscore("HORA"),
      value: formatTime(e.data.hour, e.data.utc),
    })
    .addFields({ name: "\u200B", value: "\u200B" })
    .addFields(assistance)
    .setImage(e.data.image || DEFAULT_IMAGE)
    .setURL(e.data.link || null)
    .setTimestamp()
    .setFooter(footer ? { text: footer } : null);

  return message;
};

export default CustomizeEmbed;
