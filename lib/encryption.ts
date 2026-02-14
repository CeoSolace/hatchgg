import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const keyBase64 = process.env.ENCRYPTION_KEY;

if (!keyBase64) {
  throw new Error('Missing ENCRYPTION_KEY environment variable');
}

const ENCRYPTION_KEY = Buffer.from(keyBase64, 'base64');
const IV_LENGTH = 12; // 96 bits for GCM

export interface EncryptedField {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns base64 encoded cipher text, iv and authTag.
 */
export function encryptField(plaintext: string): EncryptedField {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

/**
 * Decrypt a previously encrypted field. Throws if decryption fails.
 */
export function decryptField(data: EncryptedField): string {
  const iv = Buffer.from(data.iv, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(Buffer.from(data.authTag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data.ciphertext, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}