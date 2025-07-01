import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  // Protect API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/fetch-pools')) {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/fetch-pools/:path*',
    // Add other protected API routes here
  ]
}
