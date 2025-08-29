'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get the email from the URL params
    const email = searchParams.get('email')
    
    // Redirect to homepage with verification modal parameters
    const params = new URLSearchParams()
    if (email) params.set('email', email)
    params.set('showVerifyModal', 'true')
    
    router.replace(`/?${params.toString()}`)
  }, [router, searchParams])

  // Show a simple loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  )
}
