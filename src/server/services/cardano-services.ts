import CardanoWasm, {
  EnterpriseAddress,
  Ed25519KeyHash,
  Bip32PublicKey
} from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';

export enum NetworkIdentifier {
  WHATEVER_NETWORK
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): EnterpriseAddress | null;
}

const convertPublicKeyToHash = (publicKey: string, logger: Logger): Ed25519KeyHash => {
  logger.debug('[convertePublicKeyToHash] Converting public key string to hash');
  const publicKeyBytes = new Uint8Array(Buffer.from(publicKey));
  return Bip32PublicKey.from_bytes(publicKeyBytes)
    .to_raw_key()
    .hash();
};

// TODO do something with curve type?
const getPublicKeyStringFromPublicKey = (publicKey: Components.Schemas.PublicKey) => publicKey.hex_bytes;

const configure = (logger: Logger): CardanoService => ({
  generateAddress(network, publicKey) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );
    const publicKeyString = getPublicKeyStringFromPublicKey(publicKey);
    const publicKeyHash = convertPublicKeyToHash(publicKeyString, logger);
    logger.debug('[generateAddress] Public key hash has been derived succesfuly from public key string');
    const baseAddr = CardanoWasm.EnterpriseAddress.new(
      network,
      CardanoWasm.StakeCredential.from_keyhash(publicKeyHash)
    );
    if (!baseAddr) {
      return null;
    }
    logger.info(`[generateAddress] base address is ${baseAddr}`);
    return baseAddr;
  }
});

export default configure;
