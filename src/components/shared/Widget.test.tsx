import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Widget } from './Widget'
import { AppConfigContext } from '@/contexts/AppConfig/context'
import type { AppConfigContextType } from '@/contexts/AppConfig/types'
import type { Widget as WidgetType } from '@/types'

// Mock the context value
const mockContextValue: AppConfigContextType = {
  config: {
    elements: [],
    settings: {
      theme: 'glassmorphism',
    },
    _v: '0.0.2',
  },
  isInEditMode: false,
  updateConfig: vi.fn(),
  updateTheme: vi.fn(),
  updateEditMode: vi.fn(),
  updateElementById: vi.fn(),
  removeElementById: vi.fn(),
  getTheme: vi.fn(() => 'glassmorphism'),
}

const renderWithContext = (
  component: React.ReactElement,
  contextValue: AppConfigContextType = mockContextValue
) => {
  return render(
    <AppConfigContext.Provider value={contextValue}>
      {component}
    </AppConfigContext.Provider>
  )
}

describe('Widget', () => {
  const mockWidget: WidgetType = {
    id: 'test-widget-1',
    type: 'test-widget',
    gridArea: {
      rowStart: 1,
      rowEnd: 2,
      columnStart: 1,
      columnEnd: 2,
    },
  }

  it('should render children correctly', () => {
    renderWithContext(
      <Widget {...mockWidget}>
        <div>Test Content</div>
      </Widget>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply grid area styles correctly', () => {
    const { container } = renderWithContext(
      <Widget {...mockWidget}>
        <div>Test</div>
      </Widget>
    )

    const widget = container.querySelector('[style*="grid-area"]')
    expect(widget).toHaveStyle({
      gridArea: '1 / 1 / 2 / 2',
    })
  })

  it('should not show delete button when not in edit mode', () => {
    renderWithContext(
      <Widget {...mockWidget}>
        <div>Test</div>
      </Widget>
    )

    const deleteButton = screen.queryByRole('button', { name: /delete/i })
    expect(deleteButton).not.toBeInTheDocument()
  })

  it('should show delete button when in edit mode', () => {
    const editModeContext: AppConfigContextType = {
      ...mockContextValue,
      isInEditMode: true,
    }

    renderWithContext(
      <Widget {...mockWidget}>
        <div>Test</div>
      </Widget>,
      editModeContext
    )

    const deleteButton = screen.getByRole('button')
    expect(deleteButton).toBeInTheDocument()
  })

  it('should call removeElementById when delete button is clicked', async () => {
    const removeElementById = vi.fn()
    const editModeContext: AppConfigContextType = {
      ...mockContextValue,
      isInEditMode: true,
      removeElementById,
    }

    const user = userEvent.setup()

    renderWithContext(
      <Widget {...mockWidget}>
        <div>Test</div>
      </Widget>,
      editModeContext
    )

    const deleteButton = screen.getByRole('button')
    await user.click(deleteButton)

    expect(removeElementById).toHaveBeenCalledWith('test-widget-1')
  })
})

