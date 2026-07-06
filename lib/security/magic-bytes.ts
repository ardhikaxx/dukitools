const SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  zip_based: [0x50, 0x4b, 0x03, 0x04],
};

export function detectFileSignature(buffer: Buffer): string | null {
  for (const [type, signature] of Object.entries(SIGNATURES)) {
    if (signature.every((byte, i) => buffer[i] === byte)) return type;
  }
  return null;
}
