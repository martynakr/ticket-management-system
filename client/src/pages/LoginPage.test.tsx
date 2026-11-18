import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from '../App'
import { AuthProvider } from '../auth/AuthContext'
import { mockFetch } from '../test/fetch'

const notLoggedIn = { 'GET /api/auth/me': { status: 401, body: { error: 'Not authenticated' } } }
const admin = { id: '1', name: 'Ada', email: 'ada@example.com', role: 'admin' }

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()
  await user.type(await screen.findByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
}

afterEach(() => vi.unstubAllGlobals())

describe('LoginPage', () => {
  it('shows validation errors without calling the API', async () => {
    const fetchMock = mockFetch(notLoggedIn)
    renderAt('/login')

    await userEvent.click(await screen.findByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shows the server error when the credentials are wrong', async () => {
    mockFetch({
      ...notLoggedIn,
      'POST /api/auth/login': { status: 401, body: { error: 'Invalid email or password' } },
    })
    renderAt('/login')

    await fillAndSubmit('ada@example.com', 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
  })

  it('goes to the home page after logging in', async () => {
    mockFetch({ ...notLoggedIn, 'POST /api/auth/login': { status: 200, body: { user: admin } } })
    renderAt('/login')

    await fillAndSubmit('ada@example.com', 'correct-password')

    expect(await screen.findByText('Signed in as Ada (admin)')).toBeInTheDocument()
  })

  it('skips the form when already logged in', async () => {
    mockFetch({ 'GET /api/auth/me': { status: 200, body: { user: admin } } })
    renderAt('/login')

    expect(await screen.findByText('Signed in as Ada (admin)')).toBeInTheDocument()
  })
})
