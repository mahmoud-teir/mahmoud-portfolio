import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Hr,
    Tailwind
} from '@react-email/components'
import * as React from 'react'

interface ContactFormEmailProps {
    name: string
    email: string
    message: string
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
    name,
    email,
    message,
}) => (
    <Html>
        <Head />
        <Preview>New incoming transmission from {name}</Preview>
        <Tailwind>
            <Body className="bg-white my-auto mx-auto font-mono text-black">
                <Container className="border-4 border-black my-[40px] mx-auto p-[20px] max-w-[600px] shadow-[8px_8px_0px_0px_rgba(173,255,47,1)]">
                    <Section className="bg-black text-[#adff2f] p-4 mb-6">
                        <Heading className="text-2xl font-black uppercase text-center m-0 tracking-widest">
                            TRANSMISSION_RECEIVED
                        </Heading>
                    </Section>

                    <Section className="mb-6">
                        <Text className="text-sm font-bold uppercase mb-1 opacity-50">SENDER:</Text>
                        <Text className="text-xl font-bold uppercase m-0 border-l-4 border-black pl-4">
                            {name}
                        </Text>
                    </Section>

                    <Section className="mb-6">
                        <Text className="text-sm font-bold uppercase mb-1 opacity-50">RETURN_ADDRESS:</Text>
                        <Text className="text-lg font-bold m-0 border-l-4 border-black pl-4">
                            {email}
                        </Text>
                    </Section>

                    <Hr className="border-2 border-black border-dashed my-6" />

                    <Section className="bg-gray-50 p-6 border-2 border-black">
                        <Text className="text-sm font-bold uppercase mb-4 opacity-50">DECRYPTED_PAYLOAD:</Text>
                        <Text className="text-base font-medium whitespace-pre-wrap m-0">
                            {message}
                        </Text>
                    </Section>

                    <Hr className="border-2 border-black my-6" />

                    <Text className="text-xs text-center font-bold uppercase opacity-60">
                        Powered by Brutalist OS • Secure Transmission Protocol • End of Message
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
)

export default ContactFormEmail
