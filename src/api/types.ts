import {
  BigMapAbstraction,
  MichelsonMap,
  TezosToolkit,
} from "@taquito/taquito";
import Big from "big.js";
export type _error = { data: { with: { string: string } }[] };
export interface t_phase {
  name: string;
  utz_cost: Big;
  from_date: Big;
  to_date: Big;
  from_token_id: Big;
  to_token_id: Big;
  white_listed_only: boolean;
  max_tokens_per_white_listed_wallet: Big;
  max_mint_per_tx: Big;
  last_token_block_level: null | Big;
  minted_tokens: null | Big;
  distribution_starting_from: null | Big;
}
export type t_wanted = { token_id: Big; level: Big };
export interface t_reward {
  wanted: t_wanted[];
  bonuz: t_wanted[];
  expire_on: Big;
  reward_ratio: Big;
  bonuz_jailed: Big[];
  multiplied: Big;
  cashed: Big;
  pool: Big;
  complete: boolean;
  created_with_block_level: Big;
  fugitives_hash: string;
  created: Big;
}
export interface t_salez_storage {
  administrator: string;
  collection_max_tokens: Big;
  next_token_id: Big;
  next_coin_id: Big;
  next_phase_id: Big;
  provenance_hash: string;
  managers: string[];
  fa2_contract: string;
  hidden_folder_hash: string;
  white_list: MichelsonMap<string, Big[]>;
  last_token_block_level: Big;
  allowed_coin: MichelsonMap<Big, Big>;
  last_phase: null | t_phase;
  phases_history: MichelsonMap<Big, t_phase>;
  rewards_mint_share: Big;
  rewards_list: MichelsonMap<Big, t_reward>;
  next_reward_id: Big;
  jailed: MichelsonMap<Big, null>;
  eaten: MichelsonMap<Big, null>;
  ledger: BigMapAbstraction;
  metadata: BigMapAbstraction;
  supply: BigMapAbstraction;
  token_metadata: BigMapAbstraction;
}
export interface t_level {
  level: string;
  exp: Big;
}
export interface t_fa2_storage {
  administrator: string;
  exp_chart: MichelsonMap<Big, t_level>;
  fa2_manager: string;
  next_token_id: Big;
  next_token_id_to_reveal: Big;
  ledger: BigMapAbstraction;
  metadata: BigMapAbstraction;
  operators: BigMapAbstraction;
  token_metadata: BigMapAbstraction;
}

export interface t_token_metadata {
  token_id: Big;
  token_info: MichelsonMap<string, string>;
}
/*{
  "": string;
  container: string;
  exp: Big;
  level: Big;
};*/
export type t_address = string;
export enum t_mimeType {
  PNG = "image/png",
  MP4 = "video/mp4",
}
export type t_attribute = { name: string; value: string };
export type t_attributes = t_attribute[];
export enum t_unit {
  PX = "px",
}
export interface t_formats {
  uri: string;
  mimeType: t_mimeType;
  dimensions: {
    value: string;
    unit: t_unit;
  };
}
export interface t_metadata {
  id: number;
  name: string;
  description: string;
  decimals: number;
  isBooleanAmount: boolean;
  shouldPreferSymbol: boolean;
  creators: string[];
  artifactUri: string;
  displayUri: string;
  thumbnailUri: string;
  attributes: t_attributes;
  indexedHash: string;
  artifactHash: string;
  formats: t_formats[];
  royalties: {
    decimals: number;
    shares: {
      [key: string]: string;
    };
  };
}

export type t_extra = {
  tezos: TezosToolkit;
};
