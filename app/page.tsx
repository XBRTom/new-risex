'use client';

import Login from "@/components/homepage/login";
import Sections from "@/components/homepage/sections";

export const description =
  "A login page with two vertically stacked sections. The first section has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second section has a cover image.";

const HomePage = () => {
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