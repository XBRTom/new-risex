'use client'

import React, { useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useWallet } from "@/context";
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, User, Settings, HelpCircle, LogOut, Wallet, CreditCard, Gift, X, Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Liquid-Flow",
    href: "/liquid-flow",
    description: "Receive real-time, historical and added value data to navigate Blockchain liquidity. Our data services for your need.",
  },
  {
    title: "Liquid-X",
    href: "/docs/primitives/hover-card",
    description: "Access in-depth analysis of DeFi liquidity pools to operate and understand what you do",
  },
  {
    title: "Liquid-Sync",
    href: "/docs/primitives/progress",
    description: "Synchronize 1 or many wallets to manage everything in one place",
  },
  {
    title: "Liquid-Pool",
    href: "/docs/primitives/scroll-area",
    description: "Access and interact with Liquidity Pools",
  },
  {
    title: "Liquid-O2",
    href: "/docs/primitives/tabs",
    description: "Improve market efficiencies with our incentive program",
  },
  {
    title: "Liquid-Labs",
    href: "/docs/primitives/tooltip",
    description: "Join us to developed added-value financial technologies and improve the space",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Navbar() {
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
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOutClick = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const handleSignInClick = () => {
    router.push('/')
  }

  const truncateAddress = (address: string) => {
    return address ? `${address.slice(0, 3)}...${address.slice(-6)}` : ''
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-gray-100 border-b border-gray-200"
    >
      <div className="max-w-full mx-auto px-2">
        <div className="flex justify-between items-center h-8">
          <div className="flex items-center space-x-2 flex-1">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LIQUID
              </span>
            </Link>
            {/* Desktop menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-2 text-xs">Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              LIQUID
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Value transfer like never before. We help you understand.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Why Liquid?
                      </ListItem>
                      <ListItem href="/docs/installation" title="Access">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem href="/docs/primitives/typography" title="Typography">
                        Styles for headings, paragraphs, lists...etc
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-2 text-xs">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-2 text-xs">Partners</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Become a partner
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Join our forces to improve FinTech
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Quantitative">
                        QuantX Vancouver
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/api-documentation" legacyBehavior passHref>
                    <NavigationMenuLink className="h-8 px-2 text-xs flex items-center font-bold">
                      API Documentation
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <User className="h-4 w-4 mr-1" />
                  Session
                  <span className={`ml-1 h-1.5 w-1.5 rounded-full ${session ? 'bg-green-600' : 'bg-red-600'}`}></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!session ? (
                  <DropdownMenuItem onSelect={handleSignInClick}>
                    <span className="text-xs">Sign In</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {(walletType && walletAddress) ? (
                      <>
                        <DropdownMenuItem>
                          <span className="text-xs flex items-center">
                            <Wallet className="mr-2 h-3 w-3" />
                            Wallet: {truncateAddress(walletAddress)}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDisconnect()}>
                          <span className="text-xs flex items-center text-red-600">
                            <X className="mr-2 h-3 w-3" />
                            Disconnect Wallet
                          </span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem>
                        <Link href="/" className="flex items-center text-xs">
                          <span className="text-xs flex items-center">
                            <Wallet className="mr-2 h-3 w-3" />
                            Connect Wallet
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard/overview" className="flex items-center text-xs">
                        <User className="mr-2 h-3 w-3" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/dashboard/billing" className="flex items-center text-xs">
                        <CreditCard className="mr-2 h-3 w-3" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="flex items-center text-xs">
                        <Gift className="mr-2 h-3 w-3" />
                        <span>Reward</span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="flex items-center text-xs">
                        <Settings className="mr-2 h-3 w-3" />
                        <span>Settings</span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOutClick}>
                      <span className="flex items-center text-xs text-red-600">
                        <LogOut className="mr-2 h-3 w-3" />
                        <span>Log out</span>
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white absolute top-full left-0 right-0 z-50"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/getting-started" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Getting started
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Features
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {components.map((component) => (
                    <DropdownMenuItem key={component.title}>
                      <Link href={component.href} className="w-full">
                        {component.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/partners" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Partners
              </Link>
              <Link href="/api-documentation" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                API Documentation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}