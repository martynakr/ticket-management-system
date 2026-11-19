import { screen } from '@testing-library/react'
import { mockFetch } from '../../test/fetch'
import { renderApp } from '../../test/render'

afterEach(() => vi.unstubAllGlobals())

describe('ProtectedRoute', () => {
  it.each(['/', '/users'])('sends logged-out users from %s to the login page', async (path) => {
    mockFetch({ 'GET /api/auth/me': { status: 401, body: { error: 'Not authenticated' } } })
    renderApp(path)

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })
})
