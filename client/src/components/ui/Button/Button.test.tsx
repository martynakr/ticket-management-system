import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('is a non-submitting button by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('lets className override conflicting default classes', () => {
    render(<Button className="bg-red-600">Delete</Button>)

    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-red-600')
    expect(button).not.toHaveClass('bg-indigo-600')
  })

  it('is disabled while loading', () => {
    render(<Button isLoading>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
