import z from "zod"

export const JWT_SECRET = "1213123"

export const SignupType = z.object({
    username: z.string(),
    password: z.string()
})

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}
