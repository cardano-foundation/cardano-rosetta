/* eslint-disable camelcase */
import CardanoWasm, { StakeCredential } from 'cardano-serialization-lib';
import { Logger } from 'fastify';
import { ErrorFactory } from '../errors';
import { isKeyValid } from '../validations';

/**
 * Generates a staking credential for the given PublicKey
 * @param logger
 * @param staking_credential
 */
export const getStakingCredentialFromHex = (
  logger: Logger,
  staking_credential?: Components.Schemas.PublicKey
): StakeCredential => {
  if (!staking_credential?.hex_bytes) {
    logger.error('[getStakingCredentialFromHex] Staking key not provided');
    throw ErrorFactory.missingStakingKeyError();
  }
  if (!isKeyValid(staking_credential.hex_bytes, staking_credential.curve_type)) {
    logger.info('[constructionPayloads] Staking key has an invalid format');
    throw ErrorFactory.invalidStakingKeyFormat();
  }
  const stakingKeyBuffer = Buffer.from(staking_credential.hex_bytes, 'hex');
  const stakingKey = CardanoWasm.PublicKey.from_bytes(stakingKeyBuffer);
  return StakeCredential.from_keyhash(stakingKey.hash());
};
