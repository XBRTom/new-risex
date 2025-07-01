'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Clock,
  Database,
  Settings,
  FileText,
  User,
  LogOut,
  Search,
  Menu,
  TrendingUp,
  Wallet,
  ArrowRightLeft,
  Target,
  Code2,
  BookOpen,
  Layers
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string
  isNew?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

export default function ResponsiveSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: "Dashboard",
      items: [
        { name: 'Overview', href: '/dashboard/overview', icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: 'Analytics', href: '/analytics', icon: <TrendingUp className="h-5 w-5" /> },
      ]
    },
    {
      title: "Portfolio",
      items: [
        { name: 'Holdings', href: '/dashboard/holdings', icon: <Wallet className="h-5 w-5" /> },
        { name: 'Transactions', href: '/dashboard/transactions', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { name: 'Staking', href: '/staking', icon: <Target className="h-5 w-5" />, badge: 'Beta' },
      ]
    },
    {
      title: "DeFi",
      items: [
        { name: 'Pools', href: '/dashboard/pool', icon: <Layers className="h-5 w-5" /> },
        { name: 'Liquid Pools', href: '/liquid-pools', icon: <Database className="h-5 w-5" />, isNew: true },
      ]
    },
    {
      title: "Developer",
      items: [
        { name: 'APIs', href: '/apis', icon: <Code2 className="h-5 w-5" /> },
        { name: 'Documentation', href: '/docs', icon: <BookOpen className="h-5 w-5" /> },
      ]
    }
  ]

  // Flatten for mobile/tablet view
  const allNavItems = navSections.flatMap(section => section.items).concat([
    { name: 'Account', href: '/dashboard/account', icon: <User className="h-5 w-5" /> }
  ])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const isActive = (href: string) => pathname === href

  const NavItemButton = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-2.5 px-3 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 transition-all duration-200 relative group",
        isActive(item.href) && "bg-gradient-to-r from-blue-600/10 to-cyan-600/10 text-blue-400 border-r-2 border-blue-400",
        collapsed && "justify-center px-2"
      )}
    >
      <div className="flex items-center w-full">
        {item.icon}
        {!collapsed && (
          <div className="flex items-center justify-between w-full ml-3">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="flex items-center space-x-1">
              {item.badge && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
              {item.isNew && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  New
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {isActive(item.href) && !collapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 w-1 h-6 bg-blue-400 rounded-r-full transform -translate-y-1/2"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Button>
  )

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                LIQUID
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto py-4">
        <div className="px-3">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative mb-6"
              >
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input 
                  placeholder="Search navigation..." 
                  className="pl-10 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 transition-colors" 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-6">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: sectionIndex * 0.05 }}
                      className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2"
                    >
                      {section.title}
                    </motion.h3>
                  )}
                </AnimatePresence>
                
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * section.items.length + itemIndex) * 0.02 }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={item.href} passHref>
                              <NavItemButton item={item} collapsed={collapsed} />
                            </Link>
                          </TooltipTrigger>
                          {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>
                
                {!collapsed && sectionIndex < navSections.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="my-4"
                  >
                    <Separator className="bg-gray-800" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-800">
        <div className="p-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/account" passHref>
                  <NavItemButton 
                    item={{ name: 'Account', href: '/dashboard/account', icon: <User className="h-5 w-5" /> }} 
                    collapsed={collapsed} 
                  />
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Account</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-2.5 px-3 mt-2 text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200",
                    collapsed && "justify-center px-2"
                  )}
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  )

  const BottomNavItem = ({ item }: { item: NavItem }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href} passHref>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-gray-300 hover:text-gray-400 active:text-gray-500",
                isActive(item.href) && "text-blue-400 hover:text-blue-500 active:text-blue-600"
              )}
            >
              {item.icon}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top">{item.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (isMobile || isTablet) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {(isMobile ? allNavItems.slice(0, 4) : allNavItems).map((item) => (
            <BottomNavItem key={item.name} item={item} />
          ))}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-gray-400 active:text-gray-500"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-gray-900 text-gray-100">
              <SheetHeader>
                <SheetTitle className="text-gray-100">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {allNavItems.map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex flex-col items-center justify-center py-2 px-3 text-gray-300 hover:text-gray-400 active:text-gray-500",
                        isActive(item.href) && "bg-gray-800 text-blue-400 hover:text-blue-500 active:text-blue-600"
                      )}
                    >
                      {item.icon}
                      <span className="mt-1 text-xs">{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ width: 80 }}
        animate={{ width: collapsed ? 80 : 250 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-gray-900 border-r border-gray-800 flex flex-col h-screen"
      >
        <SidebarContent />
      </motion.div>
    </TooltipProvider>
  )
}