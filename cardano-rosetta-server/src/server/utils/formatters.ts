/**
 * Returns the hex representation as string for the given Bufffer with the `0x` prefix.
 * @param buffer to ver stringified
 */
export const hexFormatter = (buffer: Buffer): string => buffer.toString('hex');

export const hashStringToBuffer = (hash: string): Buffer => Buffer.from(hash, 'hex');
