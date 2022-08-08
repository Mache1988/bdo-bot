import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Network, NetworkType } from "@airgap/beacon-sdk";
import {
  t_fa2_storage,
  t_metadata,
  t_salez_storage,
  t_token_metadata,
} from "./types";
import { unpackDataBytes } from "@taquito/michel-codec";
import axios from "axios";

export const DEV = false;
const RPC_NODES = {
  MAIN: "https://mainnet.api.tez.ie",
  TEST: "https://jakartanet.ecadinfra.com",
};
export const RPC_NODE = DEV ? RPC_NODES.TEST : RPC_NODES.MAIN;
const FA2_CONTRACTS = {
  MAIN: "KT1D71degk4dMLtAWdpWgk8Ycg1tfeNdBNHz",
  JAKARTANET: "KT1NkgDyfP2Y3bLLcvwckScVbi9hLxZRboFs",
  ITHACANET: "KT1BhHk3rXNFYy8vd34RAQokgBhXsHr2hQbG",
};
const SALE_CONTRACTS = {
  MAIN: "KT1W8Q1facYYeiwMLh1JVEGE9YZcsUXwXrk3",
  JAKARTANET: "KT1RY1kkQ3uAZc3NakWeVw1kveas7XFPoSsp",
  ITHACANET: "KT1SHzkNbXoH1oW5YdKEeEsYSt6B5PSK7SmD",
};
export const SALE_CONTRACT_ADDRESS = DEV
  ? SALE_CONTRACTS.JAKARTANET
  : SALE_CONTRACTS.MAIN;
export const FA2_CONTRACT_ADDRESS = DEV
  ? FA2_CONTRACTS.JAKARTANET
  : FA2_CONTRACTS.MAIN;

export const network: Network = DEV
  ? { type: NetworkType.JAKARTANET }
  : { type: NetworkType.MAINNET };

export const tezosStart = () => {
  const tezos = new TezosToolkit(RPC_NODE);
  tezos.setPackerProvider(new MichelCodecPacker());
  return tezos;
};
export const getFA2Storage = async (
  tezos: TezosToolkit,
  onData?: (fa2_storage: t_fa2_storage | null) => void
) => {
  let fa2_storage: t_fa2_storage | null = null;
  try {
    console.log("Getting contract");

    const query_contract = await tezos.contract.at(FA2_CONTRACT_ADDRESS);
    fa2_storage = await query_contract.storage<t_fa2_storage>();
  } catch (error) {
    console.log(error);
  }
  onData && onData(fa2_storage);
  return fa2_storage;
};
export const getSalezStorage = async (
  tezos: TezosToolkit,
  onData?: (sale_storage: t_salez_storage | null) => void
) => {
  let sale_storage: t_salez_storage | null = null;
  try {
    console.log("Getting contract");
    const query_contract = await tezos.contract.at(SALE_CONTRACT_ADDRESS);
    sale_storage = await query_contract.storage<t_salez_storage>();
  } catch (error) {
    console.log(error);
  }
  onData && onData(sale_storage);
  return sale_storage;
};

export const queryIPFS = async (
  fa2_storage: t_fa2_storage,
  token_id: number
) => {
  let uri = "";
  try {
    const query_token_metadata =
      await fa2_storage.token_metadata.get<t_token_metadata>(token_id);
    //console.log(query_token_metadata);
    if (query_token_metadata) {
      const query_ipfs = query_token_metadata.token_info.get("");
      //console.log(query_ipfs);
      if (query_ipfs) {
        const query_metadata: string = Object.values(
          unpackDataBytes({ bytes: query_ipfs }, { prim: "string" })
        )[0] as string;
        //console.log("token_metadata_uri: ", query_metadata);
        const metadata = await axios.get<t_metadata>(
          query_metadata.replace("ipfs://", "https://gateway.ipfs.io/ipfs/")
        );
        //console.log("token_metadata: ", metadata);
        const artifact_uri = metadata.data.artifactUri.replace(
          "ipfs://",
          "https://gateway.ipfs.io/ipfs/"
        );
        //console.log(artifact_uri);
        uri = artifact_uri;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return uri;
};
