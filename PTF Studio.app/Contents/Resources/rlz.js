/* Sony LZR/RLZ resource decompressor for legacy PSP PTF themes.
 * Implements the documented sceLzrDecompress stream semantics in plain JavaScript.
 */
'use strict';

const LZR_MAX_OUTPUT_BYTES = 32 * 1024 * 1024;
const LZR_PROBABILITY_SLOTS = 2800;
const LZR_INITIAL_PROBABILITY = 0x80;
const LZR_RENORM_LIMIT = 0x00FFFFFF;
const LZR_U32_MOD = 0x100000000;

function decompressLzr(input, maxOutput, offset = 0, length = input.length - offset) {
  if (!(input instanceof Uint8Array)) input = new Uint8Array(input);
  if (!Number.isInteger(offset) || !Number.isInteger(length) || offset < 0 || length < 5 || offset + length > input.length) {
    throw new Error('Malformed LZR stream bounds.');
  }
  if (!Number.isInteger(maxOutput) || maxOutput < 0 || maxOutput > LZR_MAX_OUTPUT_BYTES) {
    throw new Error('Invalid LZR output size.');
  }

  const end = offset + length;
  const out = new Uint8Array(maxOutput);
  const probs = new Uint16Array(LZR_PROBABILITY_SLOTS);
  probs.fill(LZR_INITIAL_PROBABILITY);

  let outPos = 0;
  let inPos = offset + 5;
  let code = readBigEndianU32(input, offset + 1);
  let range = 0xFFFFFFFF;
  let spec = 0;
  let corrupt = false;
  let bufOff = 0;
  let lastByte = 0;
  let lastNumberFlag = 0;

  let type = input[offset];
  if (type >= 0x80) type -= 0x100;

  function nextByte() {
    if (inPos >= end) {
      corrupt = true;
      return 0;
    }
    return input[inPos++];
  }

  if (type > 7) throw new Error('Unsupported LZR literal-context mode.');

  if (type < 0) {
    const storedLength = code;
    if (storedLength > out.length || inPos + storedLength > end) throw new Error('Malformed stored LZR block.');
    return input.slice(inPos, inPos + storedLength);
  }

  function renormalize() {
    if (range <= LZR_RENORM_LIMIT) {
      code = (code * 256 + nextByte()) % LZR_U32_MOD;
      range = (range * 256) % LZR_U32_MOD;
    }
  }

  function validProbIndex(probIndex) {
    if (probIndex < 0 || probIndex >= LZR_PROBABILITY_SLOTS) {
      corrupt = true;
      return false;
    }
    return true;
  }

  function decodeBit(probIndex) {
    if (!validProbIndex(probIndex)) return 0;
    renormalize();
    if (corrupt) return 0;
    const p = probs[probIndex];
    const bound = Math.floor(range / 256) * p;
    probs[probIndex] = p - Math.floor(p / 8);
    if (code < bound) {
      range = bound;
      probs[probIndex] += 31;
      return 1;
    }
    code -= bound;
    range -= bound;
    return 0;
  }

  function decodeBitSpeculative(probIndex) {
    if (!validProbIndex(probIndex)) return 0;
    if (spec <= LZR_RENORM_LIMIT) {
      code = (code * 256 + nextByte()) % LZR_U32_MOD;
      range = (spec * 256) % LZR_U32_MOD;
    }
    if (corrupt) return 0;
    const p = probs[probIndex];
    const bound = Math.floor(range / 256) * p;
    spec = bound;
    probs[probIndex] = p - Math.floor(p / 8);
    if (code < bound) {
      range = bound;
      probs[probIndex] += 31;
      return 1;
    }
    code -= bound;
    range -= bound;
    return 0;
  }

  function decodeNumber(bits, base, step) {
    let number = 1;
    if (bits >= 3) {
      number = number * 2 + decodeBit(base + 3 * step);
      if (bits >= 4) {
        number = number * 2 + decodeBit(base + 3 * step);
        if (bits >= 5) {
          renormalize();
          let remaining = bits;
          while (remaining >= 5) {
            if (range === 0) {
              corrupt = true;
              return 0;
            }
            number *= 2;
            range = Math.floor(range / 2);
            if (code < range) number++;
            else code -= range;
            remaining--;
          }
        }
      }
    }
    lastNumberFlag = decodeBit(base);
    number = number * 2 + lastNumberFlag;
    if (bits >= 1) {
      number = number * 2 + decodeBit(base + step);
      if (bits >= 2) number = number * 2 + decodeBit(base + 2 * step);
    }
    return number;
  }

  function selectorContext() {
    return bufOff + 2488;
  }

  function decodeLiteral(shift) {
    if (bufOff > 0) bufOff--;
    if (outPos === out.length) return false;
    const context = (Math.floor((((outPos & 7) << 8) + lastByte) / (2 ** shift))) & 7;
    const treeBase = context * 0xFF - 1;
    let node = 1;
    while (node <= 0xFF) {
      node = node * 2 + decodeBit(treeBase + node);
      if (corrupt) return false;
    }
    out[outPos++] = node & 0xFF;
    lastByte = node & 0xFF;
    return true;
  }

  function decodeMatch() {
    let slot = selectorContext();
    spec = range;
    let lengthClass = -1;
    let bit;
    do {
      slot += 8;
      bit = decodeBitSpeculative(slot);
      if (corrupt) return -1;
      lengthClass += bit;
    } while (bit !== 0 && lengthClass < 6);

    let offsetGroup = lengthClass + 2033;
    let offsetBias = 64;
    let matchLength;
    if (bit !== 0 || lengthClass >= 0) {
      const lengthContext = (lengthClass << 5) + ((((outPos * (2 ** lengthClass)) & 3) << 3)) + bufOff + 2552;
      matchLength = decodeNumber(lengthClass, lengthContext, 8);
      if (corrupt) return -1;
      if (matchLength === 0xFF) return 1;
      if (lastNumberFlag !== 0 || lengthClass > 0) {
        offsetGroup += 56;
        offsetBias = 352;
      }
    } else {
      matchLength = 1;
    }

    let index = 1;
    let offsetClass;
    do {
      offsetClass = (index << 4) - offsetBias;
      const probIndex = offsetGroup + (index << 3);
      if (probIndex >= LZR_PROBABILITY_SLOTS) return -1;
      bit = decodeBit(probIndex);
      if (corrupt) return -1;
      index = (index << 1) | bit;
    } while (offsetClass < 0);

    let backOffset;
    if (bit !== 0 || offsetClass > 0) {
      if (bit === 0) offsetClass -= 8;
      const base = offsetClass + 2344;
      if (base < 0 || base + 3 >= LZR_PROBABILITY_SLOTS) return -1;
      backOffset = decodeNumber(Math.floor(offsetClass / 8), base, 1);
      if (corrupt) return -1;
    } else {
      backOffset = 1;
    }

    if (backOffset > outPos) return -1;
    const copyEnd = outPos + matchLength + 1;
    if (copyEnd > out.length) return -1;
    bufOff = ((copyEnd + 1) & 1) + 6;
    let from = outPos - backOffset;
    while (outPos < copyEnd) out[outPos++] = out[from++];
    lastByte = out[outPos - 1];
    return 0;
  }

  let tokenBudget = Math.max(1024, maxOutput * 2 + 1024);
  while (true) {
    if (--tokenBudget < 0) throw new Error('Malformed LZR stream did not terminate.');
    const tokenIsMatch = decodeBit(selectorContext());
    if (corrupt) throw new Error('Truncated or malformed LZR stream.');
    if (tokenIsMatch === 0) {
      if (!decodeLiteral(type)) throw new Error('LZR stream exceeds its declared output size.');
    } else {
      const result = decodeMatch();
      if (result === 1) return out.slice(0, outPos);
      if (result < 0) throw new Error('Malformed LZR back-reference.');
    }
  }
}

function readBigEndianU32(bytes, offset) {
  return bytes[offset] * 0x1000000 + bytes[offset + 1] * 0x10000 + bytes[offset + 2] * 0x100 + bytes[offset + 3];
}

if (typeof module !== 'undefined' && module.exports) module.exports = { decompressLzr };
