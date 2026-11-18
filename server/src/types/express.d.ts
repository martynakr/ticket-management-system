import type { UserDocument } from '../models/user.js'

// Adds req.user, set by requireAuth.
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}
