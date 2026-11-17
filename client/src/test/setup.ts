// Adds DOM matchers like toBeInTheDocument() to expect().
// Rendered components are cleaned up after each test automatically, because
// `globals: true` lets Testing Library register its own afterEach hook.
import '@testing-library/jest-dom/vitest'
