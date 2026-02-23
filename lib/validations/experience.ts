import { z } from "zod";

export const experienceSchema = z.object({
    company: z.string().min(1, "Company name is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    current: z.boolean().default(false),
    description: z.string().optional().or(z.literal("")),
    order: z.number().int().default(0),
}).refine(data => {
    if (!data.current && !data.endDate) {
        return false;
    }
    return true;
}, {
    message: "End date is required if not marked as current",
    path: ["endDate"]
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
