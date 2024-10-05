'use client';

// import React, { useContext } from 'react';
// import { WalletContext } from "@/providers/Wallet";

// export default function Home() {
  
//   const { account, appName, handleLogin, handleLogout } = useContext(WalletContext);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Welcome to the Risex Ledger App</h1>
//       <p>Use the menu to navigate to different sections of the app.</p>
//       <h2>{appName}</h2>
//       {account ? (
//         <div>
//           <p>Connected account: <b>{account}</b></p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <button onClick={handleLogin}>Connect to XUMM</button>
//       )}
//     </div>
//     </main>
//   );
// }

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
      <div className="bg-slate-900 text-white h-screen w-full lg:w-3/5 overflow-y-auto no-scrollbar">
  <div className="space-y-16 p-8">
    
    {/* HERO Section */}
    <section id="hero" className="relative bg-cover bg-center h-[70vh] flex flex-col justify-center items-start text-left p-10"
      style={{ backgroundImage: "url('/hero-background.jpg')" }}>
      <h1 className="text-6xl font-extrabold leading-tight">Unlock The Power of Liquidity with Liquid</h1>
      <p className="text-2xl mt-4 max-w-xl">Revolutionizing liquidity management for DeFi, Liquid gives you real-time insights, deep analytics, and tools to dominate the XRPL ecosystem.</p>
      <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
        Get Started Now
      </Button>
    </section>

    {/* Problem-Solution Hook */}
    <section id="problem-solution" className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Liquidity Problems Are Overwhelming, But We Fix That.</h2>
      <p className="text-lg text-gray-400 mb-6">DeFi liquidity is fragmented, volatile, and hard to manage. Liquid brings cutting-edge solutions, consolidating liquidity management with our real-time analytics and automated tools for maximum efficiency.</p>
      <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md">Join The Revolution</Button>
    </section>

    {/* Feature Highlights Section */}
    <section id="features" className="space-y-12 text-center">
      <h2 className="text-4xl font-bold mb-8">Why Choose Liquid?</h2>
      <div className="flex flex-col lg:flex-row gap-10 justify-around">

        {/* Feature 1 */}
        <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-lg">
          <img src="/feature1.jpg" alt="Liquid-Flow" className="rounded-lg mb-4" />
          <h3 className="text-2xl font-bold mb-2">Liquid-Flow</h3>
          <p className="text-gray-400">Get real-time, historical, and added-value data to navigate blockchain liquidity. We provide the intelligence you need to stay ahead of the curve.</p>
        </div>

        {/* Feature 2 */}
        <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-lg">
          <img src="/feature2.jpg" alt="Liquid-O2" className="rounded-lg mb-4" />
          <h3 className="text-2xl font-bold mb-2">Liquid-O2</h3>
          <p className="text-gray-400">Optimize market efficiencies with our incentive programs, designed to reward your contribution to the DeFi space.</p>
        </div>

        {/* Feature 3 */}
        <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-lg">
          <img src="/feature3.jpg" alt="Liquid-Sync" className="rounded-lg mb-4" />
          <h3 className="text-2xl font-bold mb-2">Liquid-Sync</h3>
          <p className="text-gray-400">Synchronize multiple wallets across the XRPL ledger, giving you control over all your digital assets from a single platform.</p>
        </div>
      </div>
    </section>

    {/* Interactive Stats Section */}
    <section id="stats" className="text-center">
      <h2 className="text-4xl font-bold mb-8">Join a Thriving Network</h2>
      <div className="flex justify-around gap-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-3xl font-bold">500+</h3>
          <p className="text-gray-400">Liquidity Pools</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-3xl font-bold">$1B+</h3>
          <p className="text-gray-400">Total Volume Processed</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-3xl font-bold">200K+</h3>
          <p className="text-gray-400">Active Users</p>
        </div>
      </div>
    </section>

    {/* Pricing Section */}
    <section id="pricing" className="text-center space-y-8">
      <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
      <div className="flex flex-col lg:flex-row justify-center gap-8">

        {/* Pricing Tier 1 */}
        <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-1/3">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <p className="text-gray-400 mb-4">Access basic tools and analytics.</p>
          <p className="text-3xl font-bold mb-4">$0</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md w-full">Start Free</Button>
        </div>

        {/* Pricing Tier 2 */}
        <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-1/3">
          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <p className="text-gray-400 mb-4">Advanced analytics & features for power users.</p>
          <p className="text-3xl font-bold mb-4">$49/mo</p>
          <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md w-full">Get Pro</Button>
        </div>

        {/* Pricing Tier 3 */}
        <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-1/3">
          <h3 className="text-xl font-bold mb-2">Enterprise</h3>
          <p className="text-gray-400 mb-4">Custom solutions for enterprises and institutions.</p>
          <p className="text-3xl font-bold mb-4">Contact Us</p>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-md w-full">Contact Sales</Button>
        </div>
      </div>
    </section>

    {/* Call To Action Section */}
    <section id="cta" className="text-center">
      <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Liquidity?</h2>
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
