import { describe, it, expect } from 'vitest';
import { safeResolvePath, parseCommandLine, WORKSPACE_ROOT } from '../src/utils/security.js';

describe('Security & Sandboxing Tests', () => {
  it('should safely resolve paths inside workspace', () => {
    const resolved = safeResolvePath('test.txt');
    expect(resolved.startsWith(WORKSPACE_ROOT)).toBe(true);
  });

  it('should block directory traversal attacks (..)', () => {
    expect(() => {
      safeResolvePath('../outside.txt');
    }).toThrow(/Access denied/);

    expect(() => {
      safeResolvePath('nested/../../etc/passwd');
    }).toThrow(/Access denied/);
  });

  it('should block null-byte poisoning attacks', () => {
    expect(() => {
      safeResolvePath('secret.txt\0.js');
    }).toThrow(/null byte detected/);
  });

  it('should allow allowlisted commands', () => {
    const cmd = parseCommandLine('node -v');
    expect(cmd.binary).toBe('node');
    expect(cmd.args).toEqual(['-v']);
  });

  it('should block unapproved binaries', () => {
    expect(() => {
      parseCommandLine('curl http://malicious.com');
    }).toThrow(/is not permitted in this secure environment/);

    expect(() => {
      parseCommandLine('powershell -Command Remove-Item');
    }).toThrow(/is not permitted/);
  });
});

