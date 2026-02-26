'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Terminal } from 'lucide-react'

// Define the shape of a security log based on our Prisma schema
type SecurityLog = {
    id: string
    event: string
    level: string
    details: string | null
    timestamp: string
}

type FeedEvent = {
    id: string
    timestamp: string
    content: string
    type: 'log' | 'heartbeat' | 'system'
    level?: string
}

export default function LiveFeedTerminal() {
    const [events, setEvents] = useState<FeedEvent[]>([])
    const endOfFeedRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Initial system event
        setEvents([{
            id: 'init',
            timestamp: new Date().toISOString(),
            content: 'INITIALIZING SECURE TERMINAL CONNECTION...',
            type: 'system'
        }])

        const eventSource = new EventSource('/api/sse')

        eventSource.onopen = () => {
            setEvents(prev => [...prev.slice(-49), {
                id: `conn-${Date.now()}`,
                timestamp: new Date().toISOString(),
                content: 'CONNECTION ESTABLISHED. LISTENING ON PORT 443.',
                type: 'system'
            }])
        }

        eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data)

                if (parsed.type === 'connected') {
                    setEvents(prev => [...prev.slice(-49), {
                        id: `sys-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        content: parsed.message,
                        type: 'system'
                    }])
                } else if (parsed.type === 'heartbeat') {
                    // We don't always need to show heartbeats, but for effect in a brutalist UI:
                    setEvents(prev => [...prev.slice(-49), {
                        id: `hb-${Date.now()}`,
                        timestamp: parsed.timestamp,
                        content: 'SYS_HEARTBEAT_ACK',
                        type: 'heartbeat'
                    }])
                } else if (parsed.type === 'log') {
                    const logData = parsed.data as SecurityLog
                    setEvents(prev => [...prev.slice(-49), {
                        id: logData.id,
                        timestamp: logData.timestamp,
                        content: `[${logData.event}] ${logData.details || ''}`,
                        type: 'log',
                        level: logData.level
                    }])
                }
            } catch (err) {
                console.error("Failed to parse SSE message", err)
            }
        }

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err)
            setEvents(prev => [...prev.slice(-49), {
                id: `err-${Date.now()}`,
                timestamp: new Date().toISOString(),
                content: 'CONNECTION LOST. ATTEMPTING RECONNECT...',
                type: 'system',
                level: 'DANGER'
            }])
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [])

    // Auto-scroll to bottom of terminal
    useEffect(() => {
        if (endOfFeedRef.current) {
            endOfFeedRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [events])

    return (
        <div className="bg-black border-4 border-black text-[#adff2f] p-4 md:p-6 font-mono text-sm uppercase shadow-[8px_8px_0px_0px_rgba(173,255,47,0.5)] h-[300px] flex flex-col">
            <div className="flex items-center gap-3 mb-4 border-b-2 border-[#adff2f]/30 pb-4">
                <Terminal size={20} className="stroke-[3]" />
                <h3 className="font-extrabold tracking-widest text-[#adff2f]">Live_System_Feed</h3>
                <span className="ml-auto inline-block w-3 h-3 bg-[#adff2f] animate-pulse"></span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-[#adff2f] scrollbar-track-transparent">
                {events.map((evt) => {
                    const time = new Date(evt.timestamp).toLocaleTimeString('en-US', { hour12: false })
                    let colorClass = "text-[#adff2f]"

                    if (evt.type === 'system') colorClass = "text-white opacity-80"
                    if (evt.type === 'heartbeat') colorClass = "text-[#adff2f] opacity-50"
                    if (evt.level === 'WARNING') colorClass = "text-yellow-400"
                    if (evt.level === 'DANGER' || evt.level === 'ERROR') colorClass = "text-red-500 font-bold"

                    return (
                        <div key={evt.id} className="flex gap-4">
                            <span className="opacity-50 shrink-0">[{time}]</span>
                            <span className={colorClass}>
                                {evt.content}
                            </span>
                        </div>
                    )
                })}
                <div ref={endOfFeedRef} />
            </div>
        </div>
    )
}
