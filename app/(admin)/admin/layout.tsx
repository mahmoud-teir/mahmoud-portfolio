import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import AdminSidebar from "./components/admin-sidebar"

export const metadata = {
    title: "Admin // MAHMOUD.DEV",
    robots: "noindex, nofollow",
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/admin/login")
    }

    return (
        <div className="min-h-screen bg-white text-black font-mono flex relative overflow-hidden">
            {/* Background: Radial Dot Grid */}
            <div
                className="absolute inset-0 -z-10 opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <AdminSidebar user={session.user} />

            <main className="flex-1 p-6 md:p-12 lg:ml-64 min-h-screen relative">
                {/* Viewport Frame logic for dashboard */}
                <div className="fixed inset-0 pointer-events-none border-[24px] border-black opacity-[0.02] -z-10" />
                {children}
            </main>
        </div>
    )
}
