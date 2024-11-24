'use client'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import { 
    Card,
    CardContent
  } from "@/components/ui/card";
import { SignInGoogle, SignInMagicLink, SignOut } from "@/components/homepage/auth"
import { useSession } from "next-auth/react"

import { WalletConnect } from '@/components/homepage/wallet-connect'

const Login = () => {
    const { data: session, status } = useSession()

    return (
        <>
            {
                (!session?.user) ? 
                (
                    <Tabs defaultValue="Login" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="Login">Sign In</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Login" className="border-gray-400">
                            <Card className="bg-slate-800 bg-opacity-70 border-slate-900">
                                <CardContent className="grid gap-4">
                                    <SignInMagicLink provider="resend" />

                                    <SignInGoogle 
                                        provider="google" 
                                        className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                ):
                (
                    <WalletConnect />
                )
            }
        </>
    )
}
  
export default Login