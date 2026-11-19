import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('is a non-submitting button by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('is disabled while loading', () => {
    render(<Button isLoading>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
