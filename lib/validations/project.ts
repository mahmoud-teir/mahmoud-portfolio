import { z } from "zod";

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required"),
    featured: z.boolean().default(false),
    image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tags: z.array(z.string()).default([]),
    order: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
