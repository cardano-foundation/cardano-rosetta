import CardanoWasm, { StakeCredential } from 'cardano-serialization-lib';
import { Logger } from 'fastify';
import { NetworkIdentifier, EraAddressType } from '../constants';

/**
 * Returns the bech-32 address prefix based on the netowrkId acording to
 * Prefix according to: https://github.com/cardano-foundation/CIPs/tree/master/CIP5#specification
 * @param network number
 */
export const getAddressPrefix = (network: number) =>
  network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? 'addr' : 'addr_test';

/**
 * Returns the bech-32 stake address prefix based on the netowrkId acording to
 * Prefix according to: https://github.com/cardano-foundation/CIPs/tree/master/CIP5#specification
 * @param network number
 */
export const getStakeAddressPrefix = (network: number) =>
  network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? 'stake' : 'stake_test';

/**
 * Creates a new Reward address
 * @param logger
 * @param network
 * @param paymentCredential
 */
export const generateRewardAddress = (
  logger: Logger,
  network: NetworkIdentifier,
  paymentCredential: StakeCredential
): string => {
  logger.info('[generateRewardAddress] Deriving cardano reward address from valid public staking key');
  const rewardAddress = CardanoWasm.RewardAddress.new(network, paymentCredential);
  const bech32address = rewardAddress.to_address().to_bech32(getStakeAddressPrefix(network));
  logger.info(`[generateRewardAddress] reward address is ${bech32address}`);
  return bech32address;
};

/**
 * Creates a new Base address
 * @param logger
 * @param network
 * @param paymentCredential
 * @param stakingCredential
 */
export const generateBaseAddress = (
  logger: Logger,
  network: NetworkIdentifier,
  paymentCredential: StakeCredential,
  stakingCredential: StakeCredential
): string => {
  logger.info('[generateAddress] Deriving cardano address from valid public key and staking key');
  const baseAddress = CardanoWasm.BaseAddress.new(network, paymentCredential, stakingCredential);
  const bech32address = baseAddress.to_address().to_bech32(getAddressPrefix(network));
  logger.info(`[generateAddress] base address is ${bech32address}`);
  return bech32address;
};

/**
 * Creates a new Enterprise Address
 * @param logger
 * @param network
 * @param paymentCredential
 */
export const generateEnterpriseAddress = (
  logger: Logger,
  network: NetworkIdentifier,
  paymentCredential: StakeCredential
): string => {
  // Enterprise address - default scenario
  logger.info('[generateAddress] Deriving cardano enterprise address from valid public key');
  const enterpriseAddress = CardanoWasm.EnterpriseAddress.new(network, paymentCredential);
  const bech32enterpriseAddress = enterpriseAddress.to_address().to_bech32(getAddressPrefix(network));
  logger.info(`[generateAddress] enterprise address is ${bech32enterpriseAddress}`);
  return bech32enterpriseAddress;
};

export const getEraAddressType = (address: string): EraAddressType | null => {
  if (CardanoWasm.ByronAddress.is_valid(address)) {
    return EraAddressType.Byron;
  }
  try {
    CardanoWasm.Address.from_bech32(address);
    return EraAddressType.Shelley;
  } catch (error) {
    return null;
  }
};

export const parseAddress = (address: string): CardanoWasm.Address | null => {
  const addressType = getEraAddressType(address);
  switch (addressType) {
    case EraAddressType.Shelley: {
      return CardanoWasm.Address.from_bech32(address);
    }
    case EraAddressType.Byron: {
      const byronAddress = CardanoWasm.ByronAddress.from_base58(address);
      return byronAddress.to_address();
    }
    default:
      return null;
  }
};
