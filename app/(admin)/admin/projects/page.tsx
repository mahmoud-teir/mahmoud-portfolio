import prisma from "@/lib/db"
import ProjectsManager from "../components/projects-manager"

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { order: "desc" },
    })

    return <ProjectsManager projects={projects} />
}
