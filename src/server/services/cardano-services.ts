import CardanoWasm, {
  EnterpriseAddress,
  Ed25519KeyHash,
  Bip32PublicKey
} from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';

// FIXME
enum NetworkIdentifier {
  WHATEVER_NETWORK
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: string): Promise<EnterpriseAddress>;
}

const convertePublicKeyToHash = (publicKey: string, logger: Logger): Ed25519KeyHash => {
  logger.debug('[convertePublicKeyToHash] Converting public key string to hash');
  const publicKeyBytes = new Uint8Array(Buffer.from(publicKey));
  return Bip32PublicKey.from_bytes(publicKeyBytes)
    .to_raw_key()
    .hash();
};

const configure = (logger: Logger): CardanoService => ({
  async generateAddress(network, publicKey) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );
    const publicKeyHash = convertePublicKeyToHash(publicKey, logger);
    logger.debug('[generateAddress] Public key hash has been derived succesfuly from public key string');
    const baseAddr = CardanoWasm.EnterpriseAddress.new(
      network,
      CardanoWasm.StakeCredential.from_keyhash(publicKeyHash)
    );
    logger.info(`[generateAddress] base address is ${baseAddr}`);
    return baseAddr;
  }
});

export default configure;
