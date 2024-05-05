import { syncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";
import * as iconv from "iconv-lite";

type EncodingType = "utf-8" | "Shift_JIS";

/**
 * Utility class for converting encoding of Uint8Array to string.
 */
export class ConvEncoding {
  #bufferArray: Uint8Array;
  #encoding: EncodingType;

  /**
   * Creates an instance of ConvEncoding.
   * @param {Uint8Array} bufferArray - The Uint8Array to be converted.
   * @param {EncodingType} encoding - The encoding type to convert to.
   */
  constructor(bufferArray: Uint8Array, encoding: EncodingType) {
    this.#bufferArray = bufferArray;
    this.#encoding = encoding;
  }

  /**
   * Converts the Uint8Array to UTF-8 encoded string.
   * @returns {string} The converted string.
   */
  @syncFuncDecorator
  toUtf8(): string {
    const buffer = Buffer.from(this.#bufferArray);
    return iconv.decode(buffer, this.#encoding);
  }
}
