import { describe, expect, it } from 'vitest';
import { isDeletionAvailable, isExpired } from '../src/services/file.service.js';
import { getExtension, hasValidSignature, isMimeAllowed } from '../src/utils/file-validation.js';
import { hashDeleteToken, tokensMatch } from '../src/utils/token.js';

describe('file validation', () => {
  it.each(['.pdf', '.doc', '.docx', '.xls', '.xlsx'])('accepts %s as an allowed extension', (extension) => {
    expect(getExtension(`handoff${extension}`)).toBe(extension);
  });

  it('rejects unsupported extensions', () => {
    expect(getExtension('secrets.zip')).toBeNull();
    expect(getExtension('../../malicious.exe')).toBeNull();
  });

  it('checks signatures for supported document families', () => {
    expect(hasValidSignature(Buffer.from('%PDF-1.7'), '.pdf')).toBe(true);
    expect(hasValidSignature(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), '.doc')).toBe(true);
    expect(hasValidSignature(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x78, 0x6c, 0x2f]), '.xlsx')).toBe(true);
    expect(hasValidSignature(Buffer.from('not a pdf'), '.pdf')).toBe(false);
  });

  it('allows browser-supplied MIME aliases used by Office files', () => {
    expect(isMimeAllowed('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx')).toBe(true);
    expect(isMimeAllowed('application/octet-stream', '.xlsx')).toBe(true);
    expect(isMimeAllowed('text/plain', '.pdf')).toBe(false);
  });
});

describe('anonymous ownership tokens', () => {
  it('hashes tokens without making the raw token recoverable', () => {
    const token = 'a-random-delete-token';
    expect(hashDeleteToken(token)).not.toContain(token);
    expect(tokensMatch(token, hashDeleteToken(token))).toBe(true);
    expect(tokensMatch('wrong-token', hashDeleteToken(token))).toBe(false);
  });
});

describe('expiration and deletion windows', () => {
  const uploadTime = new Date('2026-09-10T00:00:00.000Z');
  const deleteAvailableAt = new Date('2026-09-10T00:05:00.000Z');
  const expiresAt = new Date('2026-09-10T12:00:00.000Z');

  it('blocks manual deletion before five minutes', () => {
    expect(isDeletionAvailable(deleteAvailableAt, new Date('2026-09-10T00:04:59.999Z'))).toBe(false);
    expect(isDeletionAvailable(deleteAvailableAt, deleteAvailableAt)).toBe(true);
  });

  it('considers a file expired at its exact expiration instant', () => {
    expect(isExpired(expiresAt, new Date('2026-09-10T11:59:59.999Z'))).toBe(false);
    expect(isExpired(expiresAt, expiresAt)).toBe(true);
  });

  it('keeps the configured timestamps anchored to upload time', () => {
    expect(deleteAvailableAt.getTime() - uploadTime.getTime()).toBe(5 * 60 * 1000);
    expect(expiresAt.getTime() - uploadTime.getTime()).toBe(12 * 60 * 60 * 1000);
  });
});
