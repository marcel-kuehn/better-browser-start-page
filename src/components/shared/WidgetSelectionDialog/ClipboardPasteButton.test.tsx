import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClipboardPasteButton from './ClipboardPasteButton';
import { ClipboardIcon } from 'lucide-react';

describe('ClipboardPasteButton', () => {
  const defaultProps = {
    clipboardIcon: ClipboardIcon,
    clipboardSpan: { rowSpan: 1, columnSpan: 1 },
    isDisabled: false,
    onPaste: vi.fn(),
    pasteLabel: 'Paste',
    pasteFromClipboardLabel: 'Paste from Clipboard',
  };

  it('should not render when clipboardSpan is null', () => {
    const { container } = render(<ClipboardPasteButton {...defaultProps} clipboardSpan={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when clipboardSpan is provided', () => {
    render(<ClipboardPasteButton {...defaultProps} />);

    expect(screen.getByText(/paste from clipboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('paste-widget-button')).toBeInTheDocument();
  });

  it('should display clipboard widget size', () => {
    render(<ClipboardPasteButton {...defaultProps} />);

    expect(screen.getByText('1x1')).toBeInTheDocument();
  });

  it('should display correct size for different spans', () => {
    render(
      <ClipboardPasteButton {...defaultProps} clipboardSpan={{ rowSpan: 2, columnSpan: 3 }} />
    );

    expect(screen.getByText('2x3')).toBeInTheDocument();
  });

  it('should call onPaste when paste button is clicked', async () => {
    const user = userEvent.setup();
    const onPaste = vi.fn();
    render(<ClipboardPasteButton {...defaultProps} onPaste={onPaste} />);

    const pasteButton = screen.getByTestId('paste-widget-button');
    await user.click(pasteButton);

    expect(onPaste).toHaveBeenCalledTimes(1);
  });

  it('should disable paste button when isDisabled is true', () => {
    render(<ClipboardPasteButton {...defaultProps} isDisabled={true} />);

    const pasteButton = screen.getByTestId('paste-widget-button');
    expect(pasteButton).toBeDisabled();
  });

  it('should enable paste button when isDisabled is false', () => {
    render(<ClipboardPasteButton {...defaultProps} isDisabled={false} />);

    const pasteButton = screen.getByTestId('paste-widget-button');
    expect(pasteButton).not.toBeDisabled();
  });

  it('should render separator', () => {
    const { container } = render(<ClipboardPasteButton {...defaultProps} />);

    // Separator is rendered as a sibling element
    // The component returns a fragment with the button container and separator
    // Check that we have multiple direct children (the div and separator)
    const children = Array.from(container.firstChild?.childNodes || []);
    expect(children.length).toBeGreaterThan(1);

    // The separator should be present (Radix UI separator renders as a div)
    const separator = container.querySelector('[data-orientation]');
    expect(separator).toBeInTheDocument();
  });

  it('should use custom labels', () => {
    render(
      <ClipboardPasteButton
        {...defaultProps}
        pasteLabel="Custom Paste"
        pasteFromClipboardLabel="Custom Clipboard Label"
      />
    );

    expect(screen.getByText('Custom Clipboard Label')).toBeInTheDocument();
    expect(screen.getByText('Custom Paste')).toBeInTheDocument();
  });
});
