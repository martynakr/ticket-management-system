import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockFetch } from '../../test/fetch'
import { renderApp } from '../../test/render'

const admin = { id: '1', name: 'Ada', email: 'ada@example.com', role: 'admin' }

afterEach(() => vi.unstubAllGlobals())

describe('HomePage', () => {
  it('logs out', async () => {
    mockFetch({
      'GET /api/auth/me': { status: 200, body: { user: admin } },
      'POST /api/auth/logout': { status: 204 },
    })
    renderApp('/')

    await userEvent.click(await screen.findByRole('button', { name: 'Log out' }))

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })
})
