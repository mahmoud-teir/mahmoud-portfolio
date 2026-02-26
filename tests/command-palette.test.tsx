import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { CommandPalette } from '@/components/ui/command-palette'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the server action
vi.mock('@/app/actions/search', () => ({
    searchAll: vi.fn().mockImplementation(async (query: string) => {
        if (query === 'react') {
            return [
                { id: '1', title: 'React Dashboard', type: 'PROJECT', href: '/project/1' }
            ]
        }
        return []
    })
}))

describe('CommandPalette', () => {
    beforeEach(() => {
        // Reset DOM state before each test
        document.body.innerHTML = ''
    })

    it('opens when CMD+K is pressed', () => {
        render(<CommandPalette />)

        // Assert modal is not initially visible
        expect(screen.queryByPlaceholderText(/SEARCH/i)).not.toBeInTheDocument()

        // Trigger CMD+K
        fireEvent.keyDown(document, { key: 'k', metaKey: true })

        // Assert modal is visible
        expect(screen.getByPlaceholderText(/SEARCH/i)).toBeInTheDocument()
        expect(screen.getByText('SYSTEM_READY. ENTER QUERY TO INITIATE SCAN.')).toBeInTheDocument()
    })

    it('can be opened via custom event', () => {
        render(<CommandPalette />)

        // Dispatch custom event
        act(() => {
            window.dispatchEvent(new Event('open-command-palette'))
        })

        // Assert modal is visible
        expect(screen.getByPlaceholderText(/SEARCH/i)).toBeInTheDocument()
    })

    it('closes on Escape key', () => {
        render(<CommandPalette />)

        // Open it
        act(() => {
            window.dispatchEvent(new Event('open-command-palette'))
        })
        expect(screen.getByPlaceholderText(/SEARCH/i)).toBeInTheDocument()

        // Close it via Escape
        act(() => {
            fireEvent.keyDown(document, { key: 'Escape' })
        })
        expect(screen.queryByPlaceholderText(/SEARCH/i)).not.toBeInTheDocument()
    })

    it('displays search results after typing', async () => {
        render(<CommandPalette />)
        act(() => {
            window.dispatchEvent(new Event('open-command-palette'))
        })

        const input = screen.getByPlaceholderText(/SEARCH/i)

        act(() => {
            fireEvent.change(input, { target: { value: 'react' } })
        })

        // Wait for debounced search to finish and render results
        await waitFor(() => {
            expect(screen.getByText('React Dashboard')).toBeInTheDocument()
            expect(screen.getByText('PROJECT')).toBeInTheDocument()
        }, { timeout: 1000 })
    })
})
