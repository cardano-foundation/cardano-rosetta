/**
 * Returns the hex representation as string for the given Bufffer with the `0x` prefix.
 * @param buffer to ver stringified
 */
export const hashFormatter = (buffer: Buffer): string => `0x${buffer.toString('hex')}`;

export const hashStringToBuffer = (hash: string): Buffer => Buffer.from(hash.replace('0x', ''), 'hex');
