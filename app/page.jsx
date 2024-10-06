'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const description =
  "A login page with two vertically stacked sections. The first section has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second section has a cover image.";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row no-scrollbar">
      {/* First vertical section: Login form */}
      <div 
      className="flex flex-col items-center justify-center py-12 w-full lg:w-2/5 h-screen overflow-y-auto no-scrollbar"
      style={{
        backgroundImage: "url('/astronaut-exploring-a-new-planet-2023-11-27-05-35-27-utc.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
        <Tabs defaultValue="Login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="Sign up">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <Card>
              {/* <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Please enter your credentials to login to your account.
                </CardDescription>
              </CardHeader> */}
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </CardContent>
              <CardFooter>
                <div className="flex items-center">
                  <CardDescription className="text-muted-foreground">
                    Don't have an account?  
                    <Link
                      href="/"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Sign up
                    </Link>
                  </CardDescription>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
            <TabsContent value="Sign up">
              <Card>
                {/* <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Make changes to your account here. Click save when you're done.
                  </CardDescription>
                </CardHeader> */}
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <Button variant="outline" className="w-full">
                      Login with Google
                    </Button>
                </CardContent>
                  <CardFooter>
                  <div className="flex items-center">
                    <CardDescription className="text-muted-foreground">
                      Already have an account?  
                      <Link
                        href="/"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Login
                      </Link>
                    </CardDescription>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        

      {/* Second vertical section: HERO, Features, Pricing */}
      <div className="bg-slate-900 text-white w-full lg:w-3/5 h-screen overflow-y-auto no-scrollbar scroll-snap-mandatory scroll-snap-y">
        <div className="space-y-16 p-8">
          
          {/* HERO Section */}
          <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}>
            <h1 className="text-6xl font-extrabold leading-tight">Unlock The Power of Liquidity with Liquid</h1>
            <p className="text-2xl mt-4 max-w-xl">Revolutionizing liquidity management for DeFi, Liquid gives you real-time insights, deep analytics, and tools to dominate the XRPL ecosystem.</p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Get Started Now
            </Button>
          </section>

            {/* HERO Section */}
            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}>
            <h1 className="text-6xl font-extrabold leading-tight">Liquidity Problems Are Overwhelming, But We Fix That.</h1>
            <p className="text-2xl mt-4 max-w-xl">DeFi liquidity is fragmented, volatile, and hard to manage. Liquid brings cutting-edge solutions, consolidating liquidity management with our solutions for maximum efficiency.</p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Join The Revolution
            </Button>
          </section>

          {/* HERO Section */}
          <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}>
            <h1 className="text-6xl font-extrabold leading-tight">Market Access data and In-depth analysis of Liquidity Pools</h1>
            <p className="text-2xl mt-4 max-w-xl">Access Market Data and analysis via our API or Liquid SAAS to evaluate Liquidity pools in a snap</p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Signup Now
            </Button>
          </section>

          {/* HERO Section */}
          <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}>
            <h1 className="text-6xl font-extrabold leading-tight">Manage Your Pool Assets and Voting Rights</h1>
            <p className="text-2xl mt-4 max-w-xl">Via Liquid you efficiently operate on the XRPL Automated Market Maker with multiple account</p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Signup Now
            </Button>
          </section>

           {/* HERO Section */}
           <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}>
            <h1 className="text-6xl font-extrabold leading-tight">Liquid-O2 token</h1>
            <p className="text-2xl mt-4 max-w-xl">Liquid-O2 natively encourage LPs to improve market efficiencies on the most efficient and secured DeFi network</p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Get it Now
            </Button>
          </section>

          {/* Call To Action Section */}
          <section id="cta" className="text-center h-screen flex flex-col justify-center scroll-snap-start">
            <h2 className="text-4xl font-bold mb-4">Ready to be part of the Revolution ?</h2>
            <p className="text-lg text-gray-400 mb-6">Join Liquid today and take control of your DeFi investments.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
              Sign Up Now
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
