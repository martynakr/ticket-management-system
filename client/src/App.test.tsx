import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import { mockFetch } from './test/fetch'

afterEach(() => vi.unstubAllGlobals())

describe('App', () => {
  it('sends unknown paths to the home page', async () => {
    mockFetch({ 'GET /api/auth/me': { status: 401, body: { error: 'Not authenticated' } } })
    render(
      <MemoryRouter initialEntries={['/nope']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })
})
