import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')
    const name = req.nextUrl.searchParams.get('name') || 'resume'

    if (!url) {
        return new NextResponse('Missing URL', { status: 400 })
    }

    try {
        const response = await fetch(url)

        if (!response.ok) {
            return new NextResponse('Failed to fetch file', { status: 502 })
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream'
        const buffer = await response.arrayBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}"`,
                'Cache-Control': 'no-cache',
            },
        })
    } catch (error) {
        return new NextResponse('Download failed', { status: 500 })
    }
}
