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

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const description =
  "A login page with two vertically stacked sections. The first section has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second section has a cover image."

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* First vertical section: Login form */}
      <div className="flex flex-col items-center justify-center py-12 w-full lg:w-1/2">
        <Card className="mx-auto grid w-[350px] gap-6">
          <CardHeader className="grid gap-2 text-center">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
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
          <CardFooter className="">
              <div className="flex items-center">
                <CardDescription className="text-balance text-muted-foreground">
                  Don't have an account ?  
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
        </div>

      {/* Second vertical section: Cover image */}
      <div className="hidden lg:block bg-muted w-full lg:w-1/2">
        <Image
          src="/placeholder.svg"
          alt="Cover Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
