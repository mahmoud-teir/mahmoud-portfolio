'use client'

import { SectionHeader } from '@/components/ui/section-header'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { submitContactForm } from '@/app/actions/contact'
import { useActionState, useEffect, useRef, useOptimistic } from 'react'

const initialState = {
    success: false,
    error: ''
}

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            className="w-full py-6 bg-black text-white font-extrabold text-2xl uppercase neo-shadow hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending}
        >
            {isPending ? 'TRANSMITTING...' : 'Send_Message'}
            {!isPending && <Send className="text-neon group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </button>
    )
}

export const Contact = ({ contactText, displayEmail }: { contactText?: string, displayEmail?: string }) => {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
    const [optimisticState, addOptimistic] = useOptimistic(
        { isPending, success: state?.success, error: state?.error },
        (currentState, newProps: { isPending: boolean }) => ({ ...currentState, ...newProps })
    )
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset()
        }
    }, [state?.success])

    const handleFormSubmit = async (formData: FormData) => {
        addOptimistic({ isPending: true })
        formAction(formData)
    }

    return (
        <section id="contact" className="py-32 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <SectionHeader title="Get_In_Touch" />
                    {contactText && (
                        <p className="text-xl font-bold uppercase mt-8 border-t-2 border-black pt-8">
                            {contactText}
                        </p>
                    )}
                    {displayEmail && (
                        <div className="mt-6">
                            <a href={`mailto:${displayEmail}`} className="inline-block text-xl md:text-3xl font-black bg-neon px-6 md:px-8 py-3 border-4 border-black hover:bg-black hover:text-[#adff2f] transition-colors uppercase neo-shadow-sm hover:translate-y-1 hover:shadow-none break-all">
                                {displayEmail}
                            </a>
                        </div>
                    )}
                </div>

                <form ref={formRef} action={handleFormSubmit} className="space-y-8">
                    {optimisticState?.success && (
                        <div className="bg-[#adff2f]/10 border-4 border-[#adff2f] text-black px-6 py-4 font-extrabold uppercase text-sm flex items-center gap-3">
                            <CheckCircle2 size={24} className="text-black" />
                            Message Transmitted Successfully. I will be in touch shortly.
                        </div>
                    )}

                    {optimisticState?.error && (
                        <div className="bg-red-50 border-4 border-red-600 text-red-600 px-6 py-4 font-bold uppercase text-sm flex items-center gap-3">
                            <AlertCircle size={20} />
                            {optimisticState.error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-lg font-extrabold uppercase">Your Name</label>
                            <input
                                name="name"
                                className="w-full px-6 py-4 border-4 border-black bg-white focus:bg-neon outline-none neo-shadow-sm focus:shadow-none transition-all font-bold placeholder:text-gray-400"
                                placeholder="NAME_HERE"
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-lg font-extrabold uppercase">Your Email</label>
                            <input
                                name="email"
                                className="w-full px-6 py-4 border-4 border-black bg-white focus:bg-neon outline-none neo-shadow-sm focus:shadow-none transition-all font-bold placeholder:text-gray-400"
                                placeholder="EMAIL_ADDRESS"
                                type="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-extrabold uppercase">Message</label>
                        <textarea
                            name="message"
                            className="w-full px-6 py-4 border-4 border-black bg-white focus:bg-neon outline-none neo-shadow-sm focus:shadow-none transition-all font-bold placeholder:text-gray-400 resize-none"
                            placeholder="DESCRIBE_PROJECT..."
                            rows={6}
                            required
                        />
                    </div>

                    <SubmitButton isPending={optimisticState.isPending} />
                </form>
            </div>
        </section>
    )
}

