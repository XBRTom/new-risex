'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useWallet } from "@/context";
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, User, Settings, HelpCircle, LogOut, Wallet, CreditCard, Gift, X, Menu, Search, Command, Layers } from 'lucide-react'
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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import apiClient from "@/libs/api"

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

// Search interfaces
interface Pool {
  id: number
  asset_currency: string
  asset2_currency: string
  account: string
  tradingFee: number
  balance?: number
}

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  section: string
  badge?: string
  isNew?: boolean
}

interface AppPage {
  name: string
  href: string
  description: string
  category: string
}

// Move static data outside component to prevent re-creation
const navItems: NavItem[] = [
  // Dashboard
  { name: 'Overview', href: '/dashboard/overview', icon: 'LayoutDashboard', section: 'Dashboard' },
  { name: 'Analytics', href: '/analytics', icon: 'TrendingUp', section: 'Dashboard' },
  // Portfolio
  { name: 'Holdings', href: '/dashboard/holdings', icon: 'Wallet', section: 'Portfolio' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: 'ArrowRightLeft', section: 'Portfolio' },
  { name: 'Staking', href: '/staking', icon: 'Target', section: 'Portfolio', badge: 'Beta' },
  // DeFi
  { name: 'Pools', href: '/dashboard/pool', icon: 'Layers', section: 'DeFi' },
  { name: 'Liquid Pools', href: '/liquid-pools', icon: 'Database', section: 'DeFi', isNew: true },
  // Developer
  { name: 'APIs', href: '/apis', icon: 'Code2', section: 'Developer' },
  { name: 'Documentation', href: '/docs', icon: 'BookOpen', section: 'Developer' },
  // Account
  { name: 'Account', href: '/dashboard/account', icon: 'User', section: 'Account' },
]

// App pages for search
const appPages: AppPage[] = [
  { name: 'Home', href: '/', description: 'Landing page and overview', category: 'Main' },
  { name: 'Dashboard', href: '/dashboard', description: 'Main dashboard overview', category: 'Dashboard' },
  { name: 'Dashboard Overview', href: '/dashboard/overview', description: 'Main dashboard overview with pools and analytics', category: 'Dashboard' },
  { name: 'Holdings', href: '/dashboard/holdings', description: 'Portfolio holdings and balances', category: 'Portfolio' },
  { name: 'Transactions', href: '/dashboard/transactions', description: 'Transaction history and details', category: 'Portfolio' },
  { name: 'Account Settings', href: '/dashboard/account', description: 'User account and preferences', category: 'Settings' },
  { name: 'API Documentation', href: '/api-documentation', description: 'Developer API reference', category: 'Developer' },
  { name: 'Billing', href: '/dashboard/billing', description: 'Subscription and billing management', category: 'Account' },
]

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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [pools, setPools] = useState<Pool[]>([])
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([])
  const [filteredPages, setFilteredPages] = useState<AppPage[]>([])
  const [isSearchingPools, setIsSearchingPools] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)


  // Debounced pool search
  const searchPools = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPools([])
      setIsSearchingPools(false)
      return
    }

    setIsSearchingPools(true)
    try {
      const response: any = await apiClient.get(`/fetch-pools/20?search=${encodeURIComponent(query)}`)
      if (response.error) {
        console.error('API error:', response.error)
        setPools([])
      } else {
        setPools(response.pools || [])
      }
    } catch (error: any) {
      console.error('Failed to search pools:', error)
      setPools([])
    }
    setIsSearchingPools(false)
  }, [])

  // Search functionality with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPools([])
      setFilteredNavItems([])
      setFilteredPages([])
    } else {
      // Filter navigation items
      const filteredNav = navItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.section.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredNavItems(filteredNav)
      
      // Filter app pages
      const filteredPageResults = appPages.filter(page => 
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPages(filteredPageResults)

      // Search pools with debouncing
      const timeoutId = setTimeout(() => {
        searchPools(searchQuery)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, searchPools])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchFocused(false)
    setPools([])
    setFilteredNavItems([])
    setFilteredPages([])
    if (searchInputRef.current) {
      searchInputRef.current.blur()
    }
  }

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle global shortcuts only when not in input fields
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        // Allow escape key to clear search when in search input
        if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
          clearSearch()
        }
        return
      }

      // Global shortcut to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
          setIsSearchFocused(true)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
            {/* Search Bar in Top Nav */}
            {session && (
              <div className="flex-shrink-0 w-60 relative hidden md:block">
                <div className={cn(
                  "relative flex items-center space-x-2 transition-all duration-200",
                  isSearchFocused && "ring-2 ring-blue-500/30 rounded-md p-1"
                )}>
                  <Search className={cn(
                    "h-4 w-4 transition-colors duration-200 flex-shrink-0",
                    isSearchFocused ? "text-blue-500" : "text-gray-600"
                  )} />
                  <Input 
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={(e) => {
                      // Delay blur to allow clicks on search results
                      setTimeout(() => setIsSearchFocused(false), 150)
                    }}
                    placeholder="Search..."
                    className={cn(
                      "h-7 w-full pl-3 pr-12 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 transition-all duration-200 text-sm",
                      "focus:border-blue-500 focus:bg-white focus:ring-0 focus:ring-offset-0 focus:outline-none",
                      "hover:border-gray-400",
                      searchQuery && "border-gray-400"
                    )}
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={clearSearch}
                        className="absolute right-8 top-1.5 h-3 w-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  {!searchQuery && (
                    <div className="absolute right-1 top-1 flex items-center space-x-1">
                      <kbd className="pointer-events-none h-4 select-none items-center gap-1 rounded border border-gray-300 bg-gray-100 px-1 font-mono text-[9px] font-medium text-gray-500 opacity-100 hidden lg:flex">
                        <Command className="h-2 w-2" />
                      </kbd>
                      <kbd className="pointer-events-none h-4 select-none items-center gap-1 rounded border border-gray-300 bg-gray-100 px-1 font-mono text-[9px] font-medium text-gray-500 opacity-100 hidden lg:flex">
                        K
                      </kbd>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                <AnimatePresence>
                  {searchQuery && searchQuery.trim() && (isSearchFocused || pools.length > 0 || filteredNavItems.length > 0 || filteredPages.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-3">
                        <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <Search className="h-3 w-3 mr-1" />
                            {filteredNavItems.length + filteredPages.length + pools.length} result(s) found
                          </div>
                          {isSearchingPools && (
                            <div className="text-xs text-blue-500">Searching...</div>
                          )}
                        </div>
                        
<div className="space-y-3 max-h-96 overflow-y-auto">
                          {/* Navigation Results */}
                          {filteredNavItems.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-2 px-1">Navigation</div>
                              <div className="space-y-1">
                                {filteredNavItems.map((item) => (
                                  <Link key={item.href} href={item.href} onClick={clearSearch}>
                                    <div className="flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                                      <div className="h-4 w-4 text-blue-500 flex items-center justify-center">
                                        <span className="text-xs">📄</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {item.section}
                                          {item.badge && ` • ${item.badge}`}
                                          {item.isNew && ' • New'}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* App Pages Results */}
                          {filteredPages.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-2 px-1">Pages</div>
                              <div className="space-y-1">
                                {filteredPages.map((page) => (
                                  <Link key={page.href} href={page.href} onClick={clearSearch}>
                                    <div className="flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                                      <div className="h-4 w-4 text-green-500 flex items-center justify-center">
                                        <span className="text-xs">🔗</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">{page.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {page.description}
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {page.category}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          
                          {/* Pool Results */}
                          {pools.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 font-medium mb-2 px-1">Pools</div>
                              <div className="space-y-1">
                                {pools.map((pool) => (
                                  <Link key={pool.id} href={`/dashboard/pool/${pool.account}`} onClick={clearSearch}>
                                    <div className="flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                                      <Layers className="h-4 w-4 text-purple-500" />
                                      <div className="flex-1">
                                        <div className="font-medium">{pool.asset_currency}/{pool.asset2_currency}</div>
                                        <div className="text-xs text-gray-500">
                                          {(pool.tradingFee / 1000).toFixed(2)}% trading fee
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {pool.account.slice(0, 8)}...
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* No Results */}
                          {filteredNavItems.length === 0 && filteredPages.length === 0 && pools.length === 0 && !isSearchingPools && (
                            <div className="text-xs text-gray-500 py-4 text-center">
                              No results found for &quot;{searchQuery}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
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