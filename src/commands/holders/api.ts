import { gql, GraphQLClient } from "graphql-request";
import { getFA2Storage } from "../../api/contract";
import { t_address, t_extra } from "../../api/types";

export enum GRAPHQL_PROVIDER {
  TZ_DOMAINS = "https://api.tezos.domains/graphql",
  TZ_PROFILES = "https://indexer.tzprofiles.com/v1/graphql",
}
export enum PROFILE_PROVIDER {
  TZ_DOMAINS = "TZ_DOMAINS",
  TZ_PROFILES = "TZ_PROFILES",
  TZ_FINGERZ = "TZ_FINGERZ",
}

const tzDomains = new GraphQLClient(GRAPHQL_PROVIDER.TZ_DOMAINS);
const tzProfiles = new GraphQLClient(GRAPHQL_PROVIDER.TZ_PROFILES);

type t_tz_domain_result = {
  reverseRecord: {
    domain: {
      name: string;
    };
  };
};
type t_tz_profile_result = {
  tzprofiles: {
    alias: string;
  }[];
};

const GET_TZ_DOMAINS = gql`
  query getProfile($address: String!) {
    reverseRecord(address: $address) {
      domain {
        name
        data {
          key
          value
        }
      }
    }
  }
`;
const GET_TZ_PROFILES = gql`
  query getProfile($address: String!) {
    tzprofiles(where: { account: { _eq: $address } }) {
      alias
    }
  }
`;

export const getProfile = async (address: string) => {
  let profile = null;
  try {
    const tz_profiles_result = await tzProfiles.request<t_tz_profile_result>(
      GET_TZ_PROFILES,
      { address }
    );
    console.log(`TZ PROFILE ADDRESS: ${address}`, tz_profiles_result);
    if (
      tz_profiles_result.tzprofiles.length > 0 &&
      tz_profiles_result.tzprofiles[0].alias
    ) {
      const { alias } = tz_profiles_result.tzprofiles[0];
      profile = { provider: PROFILE_PROVIDER.TZ_PROFILES, alias };
    } else {
      const tz_domains_result = await tzDomains.request<t_tz_domain_result>(
        GET_TZ_DOMAINS,
        { address }
      );
      console.log(`TZ DOMAINS ADDRESS: ${address}`, tz_domains_result);
      if (
        tz_domains_result.reverseRecord &&
        tz_domains_result.reverseRecord.domain &&
        tz_domains_result.reverseRecord.domain.name
      ) {
        const alias = tz_domains_result.reverseRecord.domain.name;
        profile = { provider: PROFILE_PROVIDER.TZ_DOMAINS, alias };
      }
    }
  } catch (error) {
    console.log(error);
  }

  return profile;
};
export type t_params = {
  _from: number;
  _to: number;
};
export const getHolders = async (extra: t_extra, { _from, _to }: t_params) => {
  let holders_list: {
    [address: string]: { token_ids: number[]; total: number; alias: string };
  } = {};
  try {
    if (extra) {
      const fa2_storage = await getFA2Storage(extra.tezos);
      //const salez_storage = await getSalezStorage(extra.tezos);
      if (fa2_storage) {
        for (let token_id = _from; token_id <= _to; token_id++) {
          const holder = await fa2_storage.ledger.get<t_address>(token_id);
          if (holder) {
            if (Object.prototype.hasOwnProperty.call(holders_list, holder)) {
              const token_ids = Array.from(
                holders_list[holder].token_ids
              ).concat(token_id);
              const total = holders_list[holder].total + 1;
              const alias = holders_list[holder].alias;
              holders_list = {
                ...holders_list,
                [holder]: { token_ids, total, alias },
              };
            } else {
              const profile = await getProfile(holder);
              const alias = profile ? profile.alias : "unknown";
              holders_list = {
                ...holders_list,
                [holder]: { token_ids: [token_id], total: 1, alias },
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  return holders_list;
};
