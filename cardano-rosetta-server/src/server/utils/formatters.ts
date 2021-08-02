const EMPTY_HEX = '\\x';
/**
 * This function is used to represent hex string that might be undefined or ''. In the later case, "\x"
 * is returned
 *
 * @param toFormat
 */
export const hexStringFormatter = (toFormat?: string): string => (!toFormat || toFormat === '' ? EMPTY_HEX : toFormat);

export const isEmptyHexString = (toCheck: string): boolean => toCheck === EMPTY_HEX;

/**
 * Returns the hex representation as string for the given Bufffer with the `0x` prefix.
 * @param buffer to ver stringified
 */
export const hexFormatter = (buffer: Buffer): string => buffer.toString('hex');

export const hexStringToBuffer = (input: string): Buffer => Buffer.from(isEmptyHexString(input) ? '' : input, 'hex');

export const bytesToHex = (bytes: Uint8Array): string => hexFormatter(Buffer.from(bytes));

export const add0xPrefix = (hex: string): string => (hex.startsWith('0x') ? hex : `0x${hex}`);

export const remove0xPrefix = (hex: string): string => (hex.startsWith('0x') ? hex.slice('0x'.length) : hex);
