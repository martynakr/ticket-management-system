import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('links the label to the input', () => {
    render(<Input label="Email" />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows the error and marks the input invalid', () => {
    render(<Input label="Email" error="Email is required" />)

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Email is required')
  })
})
