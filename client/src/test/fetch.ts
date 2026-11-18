type Route = { status: number; body?: unknown }

// Stubs fetch with canned responses keyed by "METHOD /path".
export function mockFetch(routes: Record<string, Route>) {
  const fetchMock = vi.fn(async (path: string, init?: RequestInit) => {
    const route = routes[`${init?.method ?? 'GET'} ${path}`]
    if (!route) throw new Error(`Unmocked request: ${init?.method ?? 'GET'} ${path}`)
    return new Response(route.body === undefined ? null : JSON.stringify(route.body), {
      status: route.status,
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
