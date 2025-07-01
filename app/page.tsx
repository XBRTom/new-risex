'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Login from "@/components/homepage/login";
import Sections from "@/components/homepage/sections";
import Loader from "@/components/ui/Loader";

const HomePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard/overview')
    }
  }, [status, session, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center space-y-3">
        <Loader size={32} />
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    )
  }

  // Show loading while redirecting authenticated users
  if (status === 'authenticated') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center space-y-3">
        <Loader size={32} />
        <span className="text-lg font-semibold">Redirecting to Dashboard...</span>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-2.5rem)] flex flex-col lg:flex-row no-scrollbar">
      <div 
        className="flex flex-col items-center justify-center py-12 w-full lg:w-2/5 h-[calc(100vh-2.5rem)] overflow-y-auto no-scrollbar bg-astronaut bg-cover bg-center"
      >
        <img src="/logo_white.svg" className="w-32 mb-8" />
        <Login />
      </div>

      <div className="bg-slate-900 text-white w-full lg:w-3/5 h-[calc(100vh-2.5rem)] overflow-y-auto no-scrollbar scroll-snap-mandatory scroll-snap-y">
        <div className="space-y-16 p-8">
          <Sections />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
