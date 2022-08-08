import axios from "axios";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { queryIPFS } from "../../api/contract";
import { t_extra, t_fa2_storage } from "../../api/types";
export const WANTED_COLOR = 0xfcba03;
export const BONUZ_COLOR = 0xfc3503;
export const getWanted = async (
  interaction: CommandInteraction,
  extra?: t_extra
) => {
  let embed: EmbedBuilder | null = null;
  try {
    if (extra) {
      const fa2_storage = extra.fa2_storage;
      const _from = interaction.options.get("from")?.value as number;
      const _to = interaction.options.get("to")?.value as number;
      const result = Math.floor(Math.random() * (_to - _from + 1)) + _from;
      let wanted_uri = "";
      if (fa2_storage) {
        wanted_uri = await queryIPFS(fa2_storage, result);
      }
      embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("WANTED FINGERZ")

        .setDescription("Mission generator")
        .setThumbnail("https://nftfingerz.xyz/static/media/wanted.8110b4f8.png")
        .addFields(
          { name: "From token ID", value: `#${_from}` },
          { name: "To token ID", value: `#${_to}` },
          { name: "Wanted token ID", value: `#${result}`, inline: true }
        )
        .setImage(wanted_uri)
        .setTimestamp();
    }
  } catch (error) {
    console.log(error);
  }
  return embed;
};
type t_params = {
  _from: number;
  _to: number;
  _team: number;
  _bonuz: number;
  _offset: number;
};
export const getWantedList = async (
  interaction: CommandInteraction,
  extra: t_extra,
  { _from, _to, _team, _bonuz, _offset }: t_params,
  black_list: number[] = []
) => {
  let wanted_embeds: EmbedBuilder[] = [];
  let bonuz_embeds: EmbedBuilder[] = [];
  try {
    if (extra) {
      if (extra.fa2_storage && extra.salez_storage) {
        const query_time = await axios.get<{ unixtime: number }>(
          "https://worldtimeapi.org/api/timezone/America/Argentina/Salta"
        );
        const { unixtime } = query_time.data;
        const jailed: number[] = [];
        for (const inJail of extra.salez_storage.jailed.keys()) {
          jailed.push(inJail.toNumber());
        }
        const eaten: number[] = [];
        for (const inMine of extra.salez_storage.eaten.keys()) {
          eaten.push(inMine.toNumber());
        }
        const wanted: number[] = [];
        for (const mission of extra.salez_storage.rewards_list.values()) {
          if (mission.expire_on.toNumber() > unixtime && !mission.complete) {
            for (const runner of mission.wanted) {
              wanted.push(runner.token_id.toNumber());
            }
            for (const runner of mission.bonuz) {
              wanted.push(runner.token_id.toNumber());
            }
          }
        }
        const banned = {
          jailed,
          eaten,
          wanted,
          black_list,
        };
        console.log(banned);

        const white_listed: number[] = [];
        const not_white_listed: number[] = black_list
          .concat(wanted)
          .concat(eaten)
          .concat(jailed);
        for (let index = _from; index <= _to; index++) {
          if (!not_white_listed.includes(index)) {
            white_listed.push(index);
          }
        }

        const team = randomize(_team, white_listed, false);
        console.log("Wanted", team.wanted);
        wanted_embeds = await Promise.all(
          team.wanted.map((w) => {
            return styledWanted(extra.fa2_storage, w.token_id);
          })
        );
        wanted_embeds.push(
          new EmbedBuilder()
            .setColor(WANTED_COLOR)
            .setTitle("TARGET LIST")
            .setDescription(JSON.stringify(team.wanted))
        );
        const bonuz = randomize(_bonuz, team.white_listed, true, _offset);
        console.log("Bonuz", bonuz.wanted);
        bonuz_embeds = await Promise.all(
          bonuz.wanted.map((w) => {
            return styledBonuz(extra.fa2_storage, w.token_id, w.level);
          })
        );
        bonuz_embeds.push(
          new EmbedBuilder()
            .setColor(BONUZ_COLOR)
            .setTitle("TARGET LIST")
            .setDescription(JSON.stringify(bonuz.wanted))
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
  return { wanted_embeds, bonuz_embeds };
};

const randomize = (
  team: number,
  WL: number[],
  use_level: boolean,
  my_offset?: number
) => {
  const white_listed = Array.from(WL);
  const wanted: { token_id: number; level: number }[] = [];
  const max_offset = 7 - team;
  const offset =
    my_offset !== undefined && my_offset <= max_offset ? my_offset : max_offset;

  for (let index = 1; index <= team; index++) {
    const random_index = Math.floor(Math.random() * white_listed.length);
    const token_id = white_listed.splice(random_index, 1)[0];
    wanted.push({ token_id, level: use_level ? index + offset : 0 });
  }
  return { wanted, white_listed };
};

const styledWanted = async (
  fa2_storage: t_fa2_storage | null,
  token_id: number
) => {
  const embed: EmbedBuilder = new EmbedBuilder();
  try {
    let wanted_uri = "";
    if (fa2_storage) {
      wanted_uri = await queryIPFS(fa2_storage, token_id);
    }
    embed
      .setColor(WANTED_COLOR)
      .setTitle(`TOKEN ID #${token_id}`)
      //.setDescription(`THREAD LEVEL #${level}`)
      .setImage(wanted_uri);
  } catch (error) {
    console.log(error);
  }
  return embed;
};
const styledBonuz = async (
  fa2_storage: t_fa2_storage | null,
  token_id: number,
  level: number
) => {
  const embed: EmbedBuilder = new EmbedBuilder();
  try {
    let wanted_uri = "";
    if (fa2_storage) {
      wanted_uri = await queryIPFS(fa2_storage, token_id);
    }
    embed
      .setColor(BONUZ_COLOR)
      .setTitle(`TOKEN ID #${token_id}`)
      .setDescription(`THREAD LEVEL #${level}`)
      .setImage(wanted_uri);
  } catch (error) {
    console.log(error);
  }
  return embed;
};
