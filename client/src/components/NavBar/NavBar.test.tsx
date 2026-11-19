import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockFetch } from '../../test/fetch'
import { renderApp } from '../../test/render'

const admin = { id: '1', name: 'Ada', email: 'ada@example.com', role: 'admin' }
const agent = { id: '2', name: 'Alan', email: 'alan@example.com', role: 'agent' }

afterEach(() => vi.unstubAllGlobals())

describe('NavBar', () => {
  it('navigates between home and users', async () => {
    mockFetch({ 'GET /api/auth/me': { status: 200, body: { user: admin } } })
    renderApp('/')

    await userEvent.click(await screen.findByRole('link', { name: 'Users' }))
    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Home' }))
    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('hides the users link from agents', async () => {
    mockFetch({ 'GET /api/auth/me': { status: 200, body: { user: agent } } })
    renderApp('/')

    expect(await screen.findByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument()
  })

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
