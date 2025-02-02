import z from "zod"

declare global {
    namespace Express {
      interface Request {
        userId: string
      }
    }
  }


export const JWT_SECRET = "1213123"

export const SignupType = z.object({
    username: z.string(),
    password: z.string()
})