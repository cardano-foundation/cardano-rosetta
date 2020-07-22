/**
 * Returns the hex representation as string for the given Bufffer with the `0x` prefix.
 * @param buffer to ver stringified
 */
export const hashFormatter = (buffer: Buffer): string => `0x${buffer.toString('hex')}`;

export const replace0xOnHash = (hash: string): string => hash.replace('0x', '');

export const hashStringToBuffer = (hash: string): Buffer => Buffer.from(replace0xOnHash(hash), 'hex');
