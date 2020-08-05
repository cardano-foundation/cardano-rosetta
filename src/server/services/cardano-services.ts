import CardanoWasm, { EnterpriseAddress } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';

const PUBLIC_KEY_LENGTH = 32;

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): string | null;
}

const isKeyValid = (key: Buffer, curveType: string): boolean =>
  key.length === PUBLIC_KEY_LENGTH && curveType === 'edwards25519';

const configure = (logger: Logger): CardanoService => ({
  generateAddress(network, publicKey) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );

    const publicKeyBuffer = Buffer.from(publicKey.hex_bytes, 'hex');

    logger.info('[generateAddress] About to check if public key has valid length and curve type');
    if (!isKeyValid(publicKeyBuffer, publicKey.curve_type)) {
      logger.info('[generateAddress] Public key has an invalid format');
      throw ErrorFactory.invalidPublicKeyFormat();
    }
    logger.info('[generateAddress] Public key has a valid format');

    const pub = CardanoWasm.PublicKey.from_bytes(publicKeyBuffer);

    logger.info('[generateAddress] Deriving cardano address from valid public key');
    const enterpriseAddress = CardanoWasm.EnterpriseAddress.new(
      NetworkIdentifier.CARDANO_MAINNET_NETWORK,
      CardanoWasm.StakeCredential.from_keyhash(pub.hash())
    );
    if (!enterpriseAddress) {
      return null;
    }
    const address = enterpriseAddress.to_address().to_bech32();
    logger.info(`[generateAddress] base address is ${address}`);
    // FIXME https://github.com/Emurgo/cardano-serialization-lib/issues/32
    return network === NetworkIdentifier.CARDANO_TESTNET_NETWORK ? address.replace('addr', 'addr_test') : address;
  }
});

export default configure;
