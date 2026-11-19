import { screen } from '@testing-library/react'
import { mockFetch } from './test/fetch'
import { renderApp } from './test/render'

afterEach(() => vi.unstubAllGlobals())

describe('App', () => {
  it('sends unknown paths to the home page', async () => {
    mockFetch({ 'GET /api/auth/me': { status: 401, body: { error: 'Not authenticated' } } })
    renderApp('/nope')

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })
})
