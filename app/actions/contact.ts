'use server'

import { Resend } from 'resend'
import { contactEmailTemplate } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'All fields are required.', success: false }
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn('Contact Form Submission (RESEND_API_KEY not set):', { name, email, message })
        return { error: 'Email service is not configured.', success: false }
    }

    try {
        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Update to your verified domain in production
            to: 'mahmoudteirbusiness@gmail.com', // Where you want to receive the emails
            subject: `New Contact from ${name} (${email})`,
            html: contactEmailTemplate(name, email, message),
            replyTo: email,
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to send contact email:', error)
        return { error: 'Failed to send message. Please try again later.', success: false }
    }
}
