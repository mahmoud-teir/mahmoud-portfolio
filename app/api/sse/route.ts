import { NextRequest } from 'next/server'
import prisma from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    let active = true

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()

            // Send initial connection heartbeat
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Connection Established' })}\n\n`))

            // Keep track of the latest log timestamp we've sent
            let lastTimestamp = new Date()

            // Poll the database every 3 seconds for new logs
            const interval = setInterval(async () => {
                if (!active) {
                    clearInterval(interval)
                    return
                }

                try {
                    // Fetch logs that occurred after our last check
                    const newLogs = await prisma.securityLog.findMany({
                        where: {
                            timestamp: {
                                gt: lastTimestamp
                            }
                        },
                        orderBy: {
                            timestamp: 'asc'
                        }
                    })

                    if (newLogs.length > 0) {
                        lastTimestamp = newLogs[newLogs.length - 1].timestamp

                        // Send each new log as an SSE event
                        newLogs.forEach(log => {
                            const data = JSON.stringify({ type: 'log', data: log })
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
                        })
                    } else {
                        // Send a heartbeat to keep connection alive
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`))
                    }
                } catch (error) {
                    console.error('SSE Polling Error:', error)
                }
            }, 3000)

            // Cleanup when the stream is cancelled by the client
            req.signal.addEventListener('abort', () => {
                active = false
                clearInterval(interval)
            })
        },
        cancel() {
            active = false
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no' // Prevent Nginx from buffering
        }
    })
}
