import { WithId } from "mongodb";

export interface TimeApi {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: null;
  dst_offset: number;
  dst_until: null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
}
export interface DataEvent {
  utc: number;
  day: number;
  hour: number;
  repeat: boolean;
  name: string;
  server: string;
  link?: string;
  image?: string;
}

export interface Member {
  user: {
    displayName: string;
    id: string;
  };
  assistance: WarRole;
  roles: {
    name: string;
    id: string;
  }[];
}
export interface Members {
  [id: string]: Member;
}
export type CalendarEvent = WithId<CalendarEventNoID>;
export interface CalendarEventNoID {
  id: string;
  data: DataEvent;
  notificateAt: number;
  guild: {
    id: string;
    name: string;
    iconURL: string | null;
  };
  roleToNotify: { name: string; id: string };
  prefix: string | undefined;
  members: Members;
  botID: string;
  expired: boolean;
}
export interface CalendarEvents {
  [id: string]: WithId<CalendarEvent>;
}
export const CONFIRMAR = "CONFIRMAR";
export const RECHAZAR = "RECHAZAR";
export const INCONCLUSO = "INCONCLUSO";

export const frontLine = "frontLine";
export const backLine = "backLine";
export const defense = "defense";
export const flank = "flank";
export const bomb = "bomb";
export const cannon = "cannon";
export const reject = "reject";
export const unknown = "unknown";

export type WarRole =
  | typeof frontLine
  | typeof backLine
  | typeof defense
  | typeof flank
  | typeof bomb
  | typeof cannon
  | typeof reject
  | typeof unknown;
export const WEEK = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
];
