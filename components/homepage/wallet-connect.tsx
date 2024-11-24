'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XamanIcon, GemWalletIcon, LedgerIcon, CroosMarkIcon } from "./wallet-icons"
import { useWallet } from "@/context";
import { useSession } from "next-auth/react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { truncateAddress } from "@/lib/utils"

type WalletProvider = {
    name: string
    code: 'xumm'|'gemwallet'|'ledger'|'crossmark'
    icon: React.ReactNode
    disabled?: boolean
}

const walletProviders: WalletProvider[] = [
    { name: 'Xaman', code: 'xumm', icon: <XamanIcon className="w-8 h-8" /> },
    { name: 'GemWallet', code: 'gemwallet', icon: <GemWalletIcon className="w-8 h-8" /> },
    { name: 'Ledger', code: 'ledger', icon: <LedgerIcon className="w-8 h-8" /> },
    { name: 'CroosMark', code: 'crossmark', icon: <CroosMarkIcon className="w-8 h-8" />, disabled: true },
]

export function WalletConnect() {
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
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

    return (
        <Card className="bg-slate-800 bg-opacity-70 border-slate-900 w-3/4">
            <CardContent className="p-6">
                <p className="text-white mb-2">Hi 👋, <span className="font-bold">{session?.user?.name}</span></p>
                {
                    (walletType && walletAddress) ?
                    (
                        <>
                            <h2 className="text-xl text-white font-bold mb-4">Connected wallet to {walletAppName} with {walletType}</h2>
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
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl text-white font-bold mb-4">Connect Your Wallet</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {walletProviders.map((provider) => (
                                    <Button
                                    key={provider.name}
                                    variant={selectedWallet === provider.name ? "default" : "outline"}
                                    className={`h-auto py-4 px-2 relative ${provider.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !provider.disabled && handleConnect(provider.code)}
                                    disabled={provider.disabled}
                                    >
                                    <div className="flex flex-col items-center">
                                        {provider.icon}
                                        <span className="mt-2 text-sm">{provider.name}</span>
                                    </div>
                                    {provider.disabled && (
                                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-md"></div>
                                    )}
                                    </Button>
                                ))}
                            </div>
                        </>
                    )
                }
                
            </CardContent>
        </Card>
    )
}
