'use client'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { SignInGoogle, SignInMagicLink, SignOut } from "@/components/homepage/auth"
import { useWallet } from "@/context";
import { useSession } from "next-auth/react"
import { Button } from "../ui/button";
import { truncateAddress } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
const Login = () => {
    //const session = await auth()
    const { data: session, status } = useSession()
    const walletContext = useWallet()

    if (!walletContext) {
        throw new Error("Wallet context is not available");
    }

    const { connectWallet, disconnectWallet, walletType, walletAddress, walletAppName } = walletContext;

    const handleConnect = (type: 'xumm' | 'gemwallet' | 'ledger' | 'crossmark' | null) => {
        connectWallet(type);
    }

    const handleDisconnect = () => {
        disconnectWallet();
    }
    if (!session?.user) 
        return <>
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
                </>
    return (
        <>
            <Card className="bg-slate-800 bg-opacity-70 border-slate-900">
                <CardContent className="grid gap-4">
                    <p className="text-white">Hi 👋, <span className="font-bold">{session.user?.name}</span></p>
                    <SignOut onSignOut={() => handleDisconnect()} variant="outline" className="w-full" />
                    {
                        (walletType && walletAddress) ?
                        (
                            <div className="flex flex-col gap-4">
                                <p className="text-white">Connected wallet to {walletAppName} with {walletType}</p>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-white cursor-pointer">Account : {truncateAddress(walletAddress)}</p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{walletAddress}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button onClick={() => handleDisconnect()}>Disconnect</Button>
                            </div>
                        ):(
                            <div className="flex flex-col gap-4">
                                <p className="text-white">Connect your wallet with</p>
                                <Button onClick={() => handleConnect('xumm')}>Xaman</Button>
                                <Button onClick={() => handleConnect('gemwallet')}>GemWallet</Button>
                                <Button onClick={() => handleConnect('crossmark')}>CrossMark</Button>
                                <Button onClick={() => handleConnect('ledger')}>Ledger</Button>
                            </div>
                        )
                    }
                    
                </CardContent>
            </Card>
            
        </>
    )
}
  
export default Login