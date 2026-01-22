import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseConfigFile } from './helpers';

describe('ConfigImport helpers', () => {
  let mockFileReader: {
    readAsText: () => void;
    result: string | null;
    error: Error | null;
    onload: ((event: { target?: { result: string } }) => void) | null;
    onerror: (() => void) | null;
  };

  beforeEach(() => {
    mockFileReader = {
      readAsText: vi.fn(),
      result: null,
      error: null,
      onload: null,
      onerror: null,
    };

    global.FileReader = vi.fn(function () {
      return mockFileReader;
    }) as unknown as typeof FileReader;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should parse valid JSON file', async () => {
    const jsonContent = JSON.stringify({ _v: '0.0.2', elements: [] });
    const file = new File([jsonContent], 'config.json', { type: 'application/json' });

    const promise = parseConfigFile(file);

    // Simulate FileReader success
    mockFileReader.result = jsonContent;
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: jsonContent } });
    }

    const result = await promise;
    expect(result).toEqual({ _v: '0.0.2', elements: [] });
  });

  it('should reject with error for invalid JSON', async () => {
    const invalidJson = '{ invalid json }';
    const file = new File([invalidJson], 'config.json', { type: 'application/json' });

    const promise = parseConfigFile(file);

    // Simulate FileReader success with invalid JSON
    mockFileReader.result = invalidJson;
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: invalidJson } });
    }

    await expect(promise).rejects.toThrow();
  });

  it('should reject when FileReader encounters an error', async () => {
    const file = new File(['content'], 'config.json', { type: 'application/json' });

    const promise = parseConfigFile(file);

    // Simulate FileReader error
    if (mockFileReader.onerror) {
      mockFileReader.onerror();
    }

    await expect(promise).rejects.toThrow('Failed to read file');
  });

  it('should handle complex JSON structure', async () => {
    const complexConfig = {
      _v: '0.0.2',
      settings: { theme: 'glassmorphism' },
      elements: [
        {
          id: '1',
          type: 'grid',
          elements: [{ id: '2', type: 'search' }],
        },
      ],
    };
    const jsonContent = JSON.stringify(complexConfig);
    const file = new File([jsonContent], 'config.json', { type: 'application/json' });

    const promise = parseConfigFile(file);

    mockFileReader.result = jsonContent;
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: jsonContent } });
    }

    const result = await promise;
    expect(result).toEqual(complexConfig);
  });

  it('should handle empty JSON object', async () => {
    const jsonContent = '{}';
    const file = new File([jsonContent], 'config.json', { type: 'application/json' });

    const promise = parseConfigFile(file);

    mockFileReader.result = jsonContent;
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: jsonContent } });
    }

    const result = await promise;
    expect(result).toEqual({});
  });
});
