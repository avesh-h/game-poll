import { z } from "zod";

export const signUpSchema = z.object({
  fistName: z.string().nonempty(),
  lastName: z.string().nonempty(),
});
