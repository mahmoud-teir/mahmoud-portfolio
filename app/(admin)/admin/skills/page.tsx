import { getSkills } from "@/app/actions/skills"
import SkillsManager from "../components/skills-manager"

export default async function AdminSkillsPage() {
    const skills = await getSkills()
    return <SkillsManager skills={skills} />
}
