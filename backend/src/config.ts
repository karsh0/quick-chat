import z from "zod"

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
