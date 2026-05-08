'use server'

import * as React from 'react'
import { Resend } from 'resend'
import ContactFormEmail from '@/emails/contact-form'
import { render } from '@react-email/components'
import { contactSchema } from '@/lib/validations/contact'
import { contactRateLimit, isRateLimitingConfigured } from '@/lib/ratelimit'
import { headers } from 'next/headers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(prevState: any, formData: FormData) {
    // 1. Rate Limiting
    if (isRateLimitingConfigured) {
        const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1"
        const { success: rateLimitSuccess } = await contactRateLimit.limit(ip)
        
        if (!rateLimitSuccess) {
            return { error: 'Too many requests. Please try again later.', success: false }
        }
    }

    // 2. Validation
    const parsed = contactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })

    if (!parsed.success) {
        const errorMessage = parsed.error.errors[0]?.message || 'Invalid form data.'
        return { error: errorMessage, success: false }
    }

    const { name, email, message } = parsed.data

    if (!process.env.RESEND_API_KEY) {
        console.warn('Contact Form Submission (RESEND_API_KEY not set):', { name, email, message })
        return { error: 'Email service is not configured.', success: false }
    }

    // 3. Email Dispatch
    try {
        await resend.emails.send({
            from: 'Contact Form <hello@mahmoud.dev>',
            to: 'mahmoudteirbusiness@gmail.com', 
            subject: `New Contact from ${name} (${email})`,
            html: await render(React.createElement(ContactFormEmail, { name, email, message }) as React.ReactElement),
            replyTo: email,
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to send contact email:', error)
        return { error: 'Failed to send message. Please try again later.', success: false }
    }
}
