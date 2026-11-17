import type { CookieOptions, Response } from 'express'

export const AUTH_COOKIE = 'token'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true, // browser JavaScript can't read it
    sameSite: 'strict', // not sent on requests coming from other sites (CSRF)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    path: '/',
  }
}

export function setAuthCookie(res: Response, token: string): void {
  // Same lifetime as the JWT.
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: ONE_DAY_MS })
}

export function clearAuthCookie(res: Response): void {
  // The browser only clears it if the options match the ones it was set with.
  res.clearCookie(AUTH_COOKIE, cookieOptions())
}
