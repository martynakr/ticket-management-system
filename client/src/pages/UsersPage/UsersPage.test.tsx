import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockFetch } from '../../test/fetch'
import { renderApp } from '../../test/render'

const admin = { id: '1', name: 'Ada', email: 'ada@example.com', role: 'admin' }
const loggedIn = { 'GET /api/auth/me': { status: 200, body: { user: admin } } }

async function fillAndSubmit(name: string, email: string, password: string) {
  const user = userEvent.setup()
  await user.type(await screen.findByLabelText('Name'), name)
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Create agent' }))
}

afterEach(() => vi.unstubAllGlobals())

describe('UsersPage', () => {
  it('shows validation errors without calling the API', async () => {
    const fetchMock = mockFetch(loggedIn)
    renderApp('/users')

    await userEvent.click(await screen.findByRole('button', { name: 'Create agent' }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('creates an agent and clears the form', async () => {
    const agent = { id: '2', name: 'Alan', email: 'alan@example.com', role: 'agent' }
    const fetchMock = mockFetch({
      ...loggedIn,
      'POST /api/users': { status: 201, body: { user: agent } },
    })
    renderApp('/users')

    await fillAndSubmit('Alan', 'alan@example.com', 'secret123')

    expect(await screen.findByRole('alert')).toHaveTextContent('Alan (alan@example.com) was created')
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        body: JSON.stringify({ name: 'Alan', email: 'alan@example.com', password: 'secret123' }),
      }),
    )
  })

  it('generates a password and shows it after the agent is created', async () => {
    const agent = { id: '2', name: 'Alan', email: 'alan@example.com', role: 'agent' }
    mockFetch({ ...loggedIn, 'POST /api/users': { status: 201, body: { user: agent } } })
    renderApp('/users')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Generate' }))
    const password = (screen.getByLabelText('Password') as HTMLInputElement).value
    expect(password).toMatch(/^[A-Za-z2-9]{16}$/)

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByLabelText('Password')).not.toHaveValue(password)

    await user.type(screen.getByLabelText('Name'), 'Alan')
    await user.type(screen.getByLabelText('Email'), 'alan@example.com')
    const generated = (screen.getByLabelText('Password') as HTMLInputElement).value
    await user.click(screen.getByRole('button', { name: 'Create agent' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(`Password: ${generated}`)
  })

  it('shows the duplicate-email error under the email field', async () => {
    mockFetch({
      ...loggedIn,
      'POST /api/users': { status: 409, body: { error: 'A user with this email already exists' } },
    })
    renderApp('/users')

    await fillAndSubmit('Ada', 'ada@example.com', 'secret123')

    expect(await screen.findByText('A user with this email already exists')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })
})
