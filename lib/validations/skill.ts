import { z } from "zod";

export const skillSchema = z.object({
    name: z.string().min(1, "Skill name is required").max(50),
    category: z.string().min(1, "Category is required").default("Frontend"),
    order: z.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;
