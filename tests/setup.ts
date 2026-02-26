import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '/',
}))

// Mock Server Actions (example for auth, etc. can be expanded later)
// vi.mock('@/lib/auth', () => ({
//   auth: { api: { getSession: vi.fn(() => Promise.resolve(null)) } }
// }))
