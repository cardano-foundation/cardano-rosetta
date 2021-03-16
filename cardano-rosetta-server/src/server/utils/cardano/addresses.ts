import CardanoWasm, { Address, ByronAddress, StakeCredential } from 'cardano-serialization-lib';
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

/**
 * Returns either Byron or Shelley address type or it throws an error
 * @param address
 */
export const getEraAddressType = (address: string): EraAddressType => {
  if (CardanoWasm.ByronAddress.is_valid(address)) {
    return EraAddressType.Byron;
  }
  CardanoWasm.Address.from_bech32(address);
  return EraAddressType.Shelley;
};

/**
 * Returns either a Shelley or a Byron Address
 * @param address base58 for Byron or bech32 for Shelley
 */
export const generateAddress = (address: string): Address => {
  const addressType = getEraAddressType(address);

  if (addressType === EraAddressType.Byron) {
    const byronAddress = ByronAddress.from_base58(address);
    return byronAddress.to_address();
  }
  return Address.from_bech32(address);
};

/**
 * Returns either a base58 string for Byron or a bech32 for Shelley
 * @param address base58 for Byron or bech32 for Shelley
 * @param addressPrefix
 */
export const parseAddress = (address: Address, addressPrefix?: string): string => {
  const byronAddress = ByronAddress.from_address(address);
  return byronAddress ? byronAddress.to_base58() : address.to_bech32(addressPrefix);
};
