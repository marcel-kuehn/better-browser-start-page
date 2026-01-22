import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridEditor } from './useGridEditor';
import { Widget, Block } from '@/types';
import { GridSpan } from './types';

describe('useGridEditor', () => {
  const createMockWidget = (
    id: string,
    gridArea: { rowStart: number; rowEnd: number; columnStart: number; columnEnd: number }
  ): Widget => ({
    id,
    type: 'test',
    gridArea,
  });

  const createMockUpdateElement = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return vi.fn((_id: string, _data: Partial<Block>) => {
      // Mock implementation
    });
  };

  it('should expand grid to top direction', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.expandGrid('top');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 3, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should expand grid to bottom direction', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.expandGrid('bottom');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 3, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should expand grid to left direction', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.expandGrid('left');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 3 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 },
        },
      ],
    });
  });

  it('should expand grid to right direction', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.expandGrid('right');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 3 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should contract grid to top direction when not occupied', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 3, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();
    window.alert = vi.fn();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('top');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should not contract grid to top when row 1 is occupied', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 3, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();
    window.alert = vi.fn();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('top');
    });

    expect(updateElementById).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Cannot contract top: The row/column contains widgets.'
    );
  });

  it('should not contract grid when span is 1', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 1, columnSpan: 2 };
    const elements: Widget[] = [];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('top');
    });

    expect(updateElementById).not.toHaveBeenCalled();
  });

  it('should contract grid to bottom direction when not occupied', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 3, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();
    window.alert = vi.fn();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('bottom');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should contract grid to left direction when not occupied', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 3 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 }),
    ];
    const updateElementById = createMockUpdateElement();
    window.alert = vi.fn();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('left');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should contract grid to right direction when not occupied', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 3 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();
    window.alert = vi.fn();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.contractGrid('right');
    });

    expect(updateElementById).toHaveBeenCalledWith(id, {
      span: { rowSpan: 2, columnSpan: 2 },
      elements: [
        {
          id: 'widget-1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    });
  });

  it('should handle multiple widgets when expanding', () => {
    const id = 'grid-1';
    const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
    const elements: Widget[] = [
      createMockWidget('widget-1', { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
      createMockWidget('widget-2', { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 }),
    ];
    const updateElementById = createMockUpdateElement();

    const { result } = renderHook(() => useGridEditor(id, span, elements, updateElementById));

    act(() => {
      result.current.expandGrid('top');
    });

    expect(updateElementById).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        elements: expect.arrayContaining([
          expect.objectContaining({ id: 'widget-1' }),
          expect.objectContaining({ id: 'widget-2' }),
        ]),
      })
    );
  });
});
