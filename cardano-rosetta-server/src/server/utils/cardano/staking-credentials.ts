/* eslint-disable camelcase */
import CardanoWasm, { StakeCredential } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../errors';
import { hexStringToBuffer } from '../formatters';
import { isKeyValid } from '../validations';

/**
 * Turns a `Components.Schemas.PublicKey` into a `CardanoWasm.PublicKey`
 * @param logger
 * @param publicKey
 */
export const getPublicKey = (logger: Logger, publicKey?: Components.Schemas.PublicKey) => {
  if (!publicKey || !publicKey.hex_bytes) {
    logger.error('[getPublicKey] Staking key not provided');
    throw ErrorFactory.missingStakingKeyError();
  }
  if (!isKeyValid(publicKey.hex_bytes, publicKey.curve_type)) {
    logger.info('[getPublicKey] Staking key has an invalid format');
    throw ErrorFactory.invalidStakingKeyFormat();
  }
  const stakingKeyBuffer = hexStringToBuffer(publicKey.hex_bytes);
  return CardanoWasm.PublicKey.from_bytes(stakingKeyBuffer);
};

/**
 * Generates a staking credential for the given PublicKey
 * @param logger
 * @param staking_credential
 */
export const getStakingCredentialFromHex = (
  logger: Logger,
  staking_credential?: Components.Schemas.PublicKey
): StakeCredential => {
  const stakingKey = getPublicKey(logger, staking_credential);
  return StakeCredential.from_keyhash(stakingKey.hash());
};
