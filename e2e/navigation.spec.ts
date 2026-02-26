import { test, expect } from '@playwright/test'

test.describe('Landing Page Navigation', () => {
    test('should load the homepage and display the hero section', async ({ page }) => {
        // Navigate to the root URL
        await page.goto('/')

        // Check that our massive hero text is present
        await expect(page.locator('h1')).toContainText('CRAFTING')
        await expect(page.locator('h1')).toContainText('ROBUST')

        // Check that main buttons are visible
        await expect(page.getByText(/explore work/i)).toBeVisible()
        await expect(page.getByText(/get in touch/i)).toBeVisible()
    })

    test('should open the Command Palette when clicking the Search button', async ({ page, isMobile }) => {
        await page.goto('/')

        // Desktop uses standard text, mobile might use an icon, but we have a Search button on both
        if (isMobile) {
            // Assuming mobile has a specific hamburger menu or search icon we should click first
            // Let's rely on the CMD+K short hand visible or the explicit button
            const searchBtn = page.locator('button').filter({ hasText: 'SEARCH' }).first()
            if (await searchBtn.isVisible()) {
                await searchBtn.click()
            } else {
                // Fallback to keyboard shortcut if button not easily targeted
                await page.keyboard.press('Meta+K')
            }
        } else {
            // Desktop Search button in Navbar
            await page.getByText('SEARCH [CMD+K]').click()
        }

        // Verify modal opens
        const searchInput = page.getByPlaceholder('SEARCH PROJECTS, SKILLS, EXPERIENCE... (CMD+K)')
        await expect(searchInput).toBeVisible()

        // Test search functionality
        await searchInput.fill('react')

        // Wait for the debounce to trigger and loading to finish 
        // Usually it takes 300ms + network delay
        await page.waitForTimeout(1000)

        // Verify that some result appears or empty state changes
        // We assume 'react' will match something in the seeds or it will display "NO_RECORDS_FOUND..."
        const noRecords = page.getByText(/NO_RECORDS_FOUND/i)
        const someResult = page.locator('ul > li').first()

        // Wait for either the empty state or an actual result
        await Promise.race([
            expect(noRecords).toBeVisible(),
            expect(someResult).toBeVisible()
        ])

        // Close the modal
        await page.keyboard.press('Escape')
        await expect(searchInput).not.toBeVisible()
    })
})
