import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // CV uploader: accepts PDF and common document formats
    cvUploader: f({
        "application/pdf": { maxFileSize: "128MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "128MB", maxFileCount: 1 },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "128MB", maxFileCount: 1 },
    })
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            let session;
            try {
                session = await auth.api.getSession({
                    headers: req.headers
                });
            } catch (e) {
                console.warn("UploadThing CV session error:", e);
                throw new UploadThingError("Authentication failed. Please log in again.");
            }

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("CV Upload complete for userId:", metadata.userId);
            console.log("file url:", file.url);

            // Update User profile CV record
            await prisma.user.update({
                where: { id: metadata.userId },
                data: { cvUrl: file.url } as any
            });

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),

    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            let session;
            try {
                session = await auth.api.getSession({
                    headers: req.headers
                });
            } catch (e) {
                console.warn("UploadThing image session error:", e);
                throw new UploadThingError("Authentication failed. Please log in again.");
            }

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Image Upload complete for userId:", metadata.userId);
            console.log("file url:", file.url);

            // Update User profile image record
            await prisma.user.update({
                where: { id: metadata.userId },
                data: { image: file.url }
            });

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
