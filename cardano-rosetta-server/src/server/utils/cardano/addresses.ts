import CardanoWasm, { Address, ByronAddress, StakeCredential } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import {
  NetworkIdentifier,
  EraAddressType,
  AddressPrefix,
  StakeAddressPrefix,
  NonStakeAddressPrefix,
  PREFIX_LENGTH
} from '../constants';
import { hexStringToBuffer } from '../formatters';
import { ManagedFreeableScope, usingAutoFree } from '../freeable';

/**
 * Returns the bech-32 address prefix based on the netowrkId
 * Prefix according to: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0005/CIP-0005.md
 * @param network number
 * @param addressPrefix the corresponding prefix enum. Defaults to non stake address prefixes
 */
export const getAddressPrefix = (network: number, addressPrefix: AddressPrefix = NonStakeAddressPrefix): string =>
  network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? addressPrefix.MAIN : addressPrefix.TEST;

/**
 * Creates a new Reward address
 * @param scope
 * @param logger
 * @param network
 * @param paymentCredential
 */
export const generateRewardAddress = (
  logger: Logger,
  network: NetworkIdentifier,
  paymentCredential: StakeCredential
): string =>
  usingAutoFree(scope => {
    logger.info('[generateRewardAddress] Deriving cardano reward address from valid public staking key');
    const rewardAddress = scope.manage(CardanoWasm.RewardAddress.new(network, paymentCredential));
    const bech32address = scope
      .manage(rewardAddress.to_address())
      .to_bech32(getAddressPrefix(network, StakeAddressPrefix));
    logger.info(`[generateRewardAddress] reward address is ${bech32address}`);
    return bech32address;
  });

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
): string =>
  usingAutoFree(scope => {
    logger.info('[generateAddress] Deriving cardano address from valid public key and staking key');
    const baseAddress = scope.manage(CardanoWasm.BaseAddress.new(network, paymentCredential, stakingCredential));
    const bech32address = scope.manage(baseAddress.to_address()).to_bech32(getAddressPrefix(network));
    logger.info(`[generateAddress] base address is ${bech32address}`);
    return bech32address;
  });

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
): string =>
  usingAutoFree(scope => {
    // Enterprise address - default scenario
    logger.info('[generateAddress] Deriving cardano enterprise address from valid public key');
    const enterpriseAddress = scope.manage(CardanoWasm.EnterpriseAddress.new(network, paymentCredential));
    const bech32enterpriseAddress = scope.manage(enterpriseAddress.to_address()).to_bech32(getAddressPrefix(network));
    logger.info(`[generateAddress] enterprise address is ${bech32enterpriseAddress}`);
    return bech32enterpriseAddress;
  });

/**
 * Returns either Byron or Shelley address type or it throws an error
 * @param address
 */
export const getEraAddressType = (address: string): EraAddressType =>
  usingAutoFree(scope => {
    if (CardanoWasm.ByronAddress.is_valid(address)) {
      return EraAddressType.Byron;
    }
    scope.manage(CardanoWasm.Address.from_bech32(address));
    return EraAddressType.Shelley;
  });

/**
 * Returns either a Shelley or a Byron Address
 * @param scope
 * @param address base58 for Byron or bech32 for Shelley
 */
export const generateAddress = (scope: ManagedFreeableScope, address: string): Address => {
  const addressType = getEraAddressType(address);

  if (addressType === EraAddressType.Byron) {
    const byronAddress = scope.manage(ByronAddress.from_base58(address));
    return scope.manage(byronAddress.to_address());
  }
  return scope.manage(Address.from_bech32(address));
};

/**
 * Returns either a base58 string for Byron or a bech32 for Shelley
 * @param address base58 for Byron or bech32 for Shelley
 * @param addressPrefix
 */
export const parseAddress = (address: Address, addressPrefix?: string): string =>
  usingAutoFree(scope => {
    const byronAddress = scope.manage(ByronAddress.from_address(address));
    return byronAddress ? byronAddress.to_base58() : address.to_bech32(addressPrefix);
  });

/**
 * Returns Reward Address type from bech32
 * @param scope
 * @param address reward address as bech32
 */
export const parseToRewardAddress = (
  scope: ManagedFreeableScope,
  address: string
): CardanoWasm.RewardAddress | undefined => {
  const wasmAddress = scope.manage(CardanoWasm.Address.from_bech32(address));
  return scope.manage(CardanoWasm.RewardAddress.from_address(wasmAddress));
};

/**
 * Returns Address type if given string is a valid address
 * otherwise will return undefined
 * @param scope
 * @param hex address as hex string
 */
export const getAddressFromHexString = (scope: ManagedFreeableScope, hex: string): Address | undefined => {
  try {
    return scope.manage(Address.from_bytes(hexStringToBuffer(hex)));
  } catch {
    // eslint-disable-next-line consistent-return
    return undefined;
  }
};
/**
 * Returns true if the address's prefix belongs to stake address
 * @param address bench 32 address
 */
export const isStakeAddress = (address: string): boolean => {
  // eslint-disable-next-line unicorn/prefer-set-has
  const addressPrefix = address.slice(0, PREFIX_LENGTH);
  return [StakeAddressPrefix.MAIN as string, StakeAddressPrefix.TEST as string].some(type =>
    addressPrefix.includes(type)
  );
};
