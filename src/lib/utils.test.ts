import { describe, it, expect } from 'vitest';
import { cn, regenerateIds } from './utils';
import { Block, Widget } from '@/types';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    // tailwind-merge should deduplicate and keep the last one
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });
});

describe('regenerateIds', () => {
  it('should generate a new ID for a simple block', () => {
    const block: Block = {
      id: 'original-id',
      type: 'clock-widget',
    };

    const result = regenerateIds(block);

    expect(result.id).not.toBe('original-id');
    expect(result.type).toBe('clock-widget');
  });

  it('should generate new IDs for nested elements', () => {
    const block: Widget = {
      id: 'parent-id',
      type: 'links-widget',
      gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
      elements: [
        { id: 'child-1', label: 'Link 1', url: 'https://example.com' },
        { id: 'child-2', label: 'Link 2', url: 'https://example2.com' },
      ],
    };

    const result = regenerateIds(block);

    expect(result.id).not.toBe('parent-id');
    expect(result.elements).toHaveLength(2);
    expect((result.elements as Block[])[0].id).not.toBe('child-1');
    expect((result.elements as Block[])[1].id).not.toBe('child-2');
  });

  it('should preserve other properties when regenerating IDs', () => {
    const block: Widget = {
      id: 'original-id',
      type: 'search-widget',
      gridArea: { rowStart: 1, rowEnd: 3, columnStart: 2, columnEnd: 4 },
      elements: [{ id: 'search-engine-1', url: 'https://google.com/search?q={query}' }],
    };

    const result = regenerateIds(block);

    expect(result.type).toBe('search-widget');
    expect(result.gridArea).toEqual({ rowStart: 1, rowEnd: 3, columnStart: 2, columnEnd: 4 });
    expect((result.elements as Block[])[0].url).toBe('https://google.com/search?q={query}');
  });

  it('should handle deeply nested elements', () => {
    const block: Block = {
      id: 'grid-id',
      type: 'grid',
      elements: [
        {
          id: 'widget-id',
          type: 'apps-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
          elements: [
            { id: 'app-1', url: 'https://app1.com' },
            { id: 'app-2', url: 'https://app2.com' },
          ],
        },
      ],
    };

    const result = regenerateIds(block);

    expect(result.id).not.toBe('grid-id');
    const widget = (result.elements as Block[])[0];
    expect(widget.id).not.toBe('widget-id');
    const apps = widget.elements as Block[];
    expect(apps[0].id).not.toBe('app-1');
    expect(apps[1].id).not.toBe('app-2');
  });

  it('should generate different ID from original', () => {
    const block: Block = {
      id: 'original-id',
      type: 'test',
    };

    const result = regenerateIds(block);

    // The ID should be different from the original
    expect(result.id).not.toBe('original-id');
    // The ID should be a non-empty string
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  it('should handle blocks without elements array', () => {
    const block: Block = {
      id: 'simple-id',
      type: 'stopwatch-widget',
    };

    const result = regenerateIds(block);

    expect(result.id).not.toBe('simple-id');
    expect(result.type).toBe('stopwatch-widget');
    expect(result.elements).toBeUndefined();
  });
});
