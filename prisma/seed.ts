import { config } from 'dotenv'
config()

import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set. Check your .env file.')
    process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function main() {
    console.log('🌱 Seeding database...')

    // Seed skills (upsert via ON CONFLICT)
    const skills = [
        { name: 'React', category: 'Frontend', order: 1 },
        { name: 'Next.js', category: 'Frontend', order: 2 },
        { name: 'Node.js', category: 'Backend', order: 3 },
        { name: 'TypeScript', category: 'Frontend', order: 4 },
        { name: 'PostgreSQL', category: 'Backend', order: 5 },
        { name: 'TailwindCSS', category: 'Frontend', order: 6 },
    ]

    for (const skill of skills) {
        await sql`
      INSERT INTO skill (id, name, category, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${skill.name}, ${skill.category}, ${skill.order}, now(), now())
      ON CONFLICT (name) DO NOTHING
    `
    }
    console.log(`  ✅ ${skills.length} skills seeded`)

    // Seed experience
    const expResult = await sql`SELECT count(*) as c FROM experience`
    if (Number(expResult[0].c) === 0) {
        await sql`
      INSERT INTO experience (id, company, role, "startDate", current, description, "order", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Tech Corp',
        'Full-Stack Engineer',
        '2023-01-01',
        true,
        'Building brutalist interfaces.',
        1,
        now(),
        now()
      )
    `
        console.log('  ✅ 1 experience seeded')
    } else {
        console.log('  ⏭️  Experience already exists, skipping')
    }

    // Seed project
    const projResult = await sql`SELECT count(*) as c FROM project`
    if (Number(projResult[0].c) === 0) {
        await sql`
      INSERT INTO project (id, title, description, featured, tags, "order", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Brutalist Portfolio',
        'A striking personal portfolio built with Next.js 15 and Tailwind v4.',
        true,
        ARRAY['Next.js', 'React', 'TailwindCSS'],
        1,
        now(),
        now()
      )
    `
        console.log('  ✅ 1 project seeded')
    } else {
        console.log('  ⏭️  Projects already exist, skipping')
    }

    console.log('✅ Seed complete!')
}

main().catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
})
