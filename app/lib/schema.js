import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please enter an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a speclialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be atleast 0 years")
        .max(50, "Expereicen cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});
