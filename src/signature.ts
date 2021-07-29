import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createVerify, createHash } from 'crypto';

// Read public key from file
const public_key = readFileSync(
  resolve(__dirname, 'instnt-sandbox-key.pem'),
  'utf-8'
);

export const verify_signature = (payload: string, signature: string) => {
  // Create SHA256 hash digest from the payload
  let hash = createHash('sha256').update(payload).digest().toString('base64');

  console.log(`Hash: ${hash}`);

  // Verify signature
  const isValid = createVerify('RSA-SHA256')
    .update(hash, 'base64')
    .verify(public_key, signature, 'base64');

  console.log(`Signature valid: ${isValid}`);

  return isValid;
};
