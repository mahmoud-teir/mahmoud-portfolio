import { getExperience } from "@/app/actions/experience"
import ExperienceManager from "../components/experience-manager"

export default async function AdminExperiencePage() {
    const experiences = await getExperience()
    return <ExperienceManager experiences={experiences} />
}
