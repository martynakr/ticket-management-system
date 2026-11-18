import type { CookieOptions, Response } from 'express'

export const AUTH_COOKIE = 'token'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: ONE_DAY_MS })
}

export function clearAuthCookie(res: Response): void {
  // Browsers only clear a cookie if the options match the ones it was set with.
  res.clearCookie(AUTH_COOKIE, cookieOptions())
}
