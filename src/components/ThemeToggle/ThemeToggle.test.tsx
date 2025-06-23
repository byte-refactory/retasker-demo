import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ThemeToggle from './ThemeToggle'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'

// Test component to display current theme name
function ThemeDisplay() {
  const { themeName } = useTheme()
  return <div data-testid="theme-display">{themeName}</div>
}

// Simple wrapper to provide theme context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ThemeDisplay />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  it('toggle button changes theme on click', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    )

    // Find the theme toggle button and theme display
    const toggleButton = screen.getByRole('button', { name: /switch to.*theme/i })
    const themeDisplay = screen.getByTestId('theme-display')
    
    expect(toggleButton).toBeInTheDocument()
    
    // Check initial theme (should be 'light' by default)
    expect(themeDisplay).toHaveTextContent('light')

    // Click to toggle theme
    await user.click(toggleButton)

    // Verify theme changed to 'dark'
    expect(themeDisplay).toHaveTextContent('dark')

    // Click again to toggle back
    await user.click(toggleButton)    // Verify theme changed back to 'light'
    expect(themeDisplay).toHaveTextContent('light')
  })

  it('loads theme from localStorage', () => {
    // Mock localStorage to start with 'dark' theme saved
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => {
          if (key === 'retasker_theme_name') return 'dark'
          return null
        }),
        setItem: vi.fn(),
      },
      writable: true,
    })

    // Render a new ThemeProvider (simulating app reload)
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    )

    // Theme should be loaded from localStorage as 'dark'
    const themeDisplay = screen.getByTestId('theme-display')
    expect(themeDisplay).toHaveTextContent('dark')

    // Button should indicate it will switch to light theme
    const toggleButton = screen.getByRole('button', { name: /switch to light theme/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('saves theme changes to localStorage', async () => {
    const user = userEvent.setup()
    
    // Create mock localStorage with spy functions
    const mockSetItem = vi.fn()
    const mockGetItem = vi.fn(() => null) // Start with no saved theme (defaults to light)
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    })

    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    )

    const toggleButton = screen.getByRole('button', { name: /switch to.*theme/i })

    // Click to toggle to dark theme
    await user.click(toggleButton)
    
    // Verify localStorage.setItem was called with 'dark'
    expect(mockSetItem).toHaveBeenCalledWith('retasker_theme_name', 'dark')

    // Click again to toggle back to light
    await user.click(toggleButton)
    
    // Verify localStorage.setItem was called with 'light'
    expect(mockSetItem).toHaveBeenCalledWith('retasker_theme_name', 'light')
    
    // Verify setItem was called exactly twice
    expect(mockSetItem).toHaveBeenCalledTimes(2)
  })
})
