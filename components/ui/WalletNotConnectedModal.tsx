'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowLeft, Zap, Shield, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@/context'
import { useSession } from 'next-auth/react'
import { XamanIcon, GemWalletIcon, LedgerIcon, CroosMarkIcon } from '@/components/homepage/wallet-icons'

interface WalletNotConnectedModalProps {
  title?: string
  description?: string
  showBackButton?: boolean
  backButtonHref?: string
  onConnect?: () => void
}

type WalletProvider = {
  name: string
  code: 'xumm'|'gemwallet'|'ledger'|'crossmark'
  icon: React.ReactNode
  disabled?: boolean
}

const walletProviders: WalletProvider[] = [
  { name: 'Xaman', code: 'xumm', icon: <XamanIcon className="w-8 h-8" />, disabled: false },
  { name: 'GemWallet', code: 'gemwallet', icon: <GemWalletIcon className="w-8 h-8" />, disabled: false },
  { name: 'Ledger', code: 'ledger', icon: <LedgerIcon className="w-8 h-8" />, disabled: true },
  { name: 'CroosMark', code: 'crossmark', icon: <CroosMarkIcon className="w-8 h-8" />, disabled: true },
]

export default function WalletNotConnectedModal({
  title = "Wallet Connection Required",
  description = "Connect your wallet to access this feature",
  showBackButton = true,
  backButtonHref = "/dashboard/overview",
  onConnect
}: WalletNotConnectedModalProps) {
  const walletContext = useWallet()
  const { data: session } = useSession()
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)
  
  const handleConnectWallet = async (walletType: 'xumm' | 'gemwallet' | 'ledger' | 'crossmark') => {
    if (walletContext?.connectWallet) {
      setConnecting(walletType)
      try {
        await walletContext.connectWallet(walletType)
        // Connection successful, modal will disappear as component will re-render
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        setConnecting(null)
      }
    }
  }
  
  const handleShowWalletOptions = () => {
    if (!session) {
      // User needs to login first
      window.location.href = '/'
    } else {
      setShowWalletOptions(true)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-yellow-400 flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">{description}</p>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-yellow-300 text-sm font-medium mb-1">Why connect your wallet?</p>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span>Secure access to your holdings</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-blue-400" />
                  <span>Real-time portfolio tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-purple-400" />
                  <span>Interact with DeFi protocols</span>
                </div>
              </div>
            </div>
          </div>
          
          {!showWalletOptions ? (
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleShowWalletOptions}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {!session ? 'Sign In & Connect Wallet' : 'Connect Wallet'}
              </Button>
              
              {showBackButton && (
                <Button asChild variant="outline" size="sm">
                  <Link href={backButtonHref}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Choose Your Wallet</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowWalletOptions(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {walletProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    className={`h-auto py-4 px-2 relative ${
                      provider.disabled ? 'cursor-not-allowed opacity-50' : ''
                    } ${connecting === provider.code ? 'opacity-50' : ''}`}
                    onClick={() => !provider.disabled && !connecting && handleConnectWallet(provider.code)}
                    disabled={provider.disabled || connecting === provider.code}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center">
                      {provider.icon}
                      <span className="mt-2 text-sm">
                        {connecting === provider.code ? 'Connecting...' : provider.name}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2 justify-center">
                {showBackButton && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={backButtonHref}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {!showWalletOptions && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm mb-2">💡 Getting Started:</p>
              <ul className="text-xs text-gray-400 text-left space-y-1">
                <li>• {!session ? 'Sign in with your account first' : 'Install a compatible wallet (Xaman, GemWallet)'}</li>
                <li>• {!session ? 'Then choose your wallet provider' : 'Click "Connect Wallet" above'}</li>
                <li>• Authorize the connection in your wallet</li>
                <li>• Return here to access your data</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
