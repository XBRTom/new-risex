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
  Menu
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
}

export default function ResponsiveSidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { name: 'Overview', href: '/dashboard/overview', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Holdings', href: '/holdings', icon: <PieChart className="h-5 w-5" /> },
    { name: 'Pools', href: '/dashboard/pool', icon: <Database className="h-5 w-5" /> },
    { name: 'Transactions', href: '/dashboard/transactions', icon: <Clock className="h-5 w-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Staking', href: '/staking', icon: <Database className="h-5 w-5" /> },
    { name: 'APIs', href: '/apis', icon: <Settings className="h-5 w-5" /> },
    { name: 'Documentation', href: '/docs', icon: <FileText className="h-5 w-5" /> },
    { name: 'Account', href: '/account', icon: <User className="h-5 w-5" /> },
  ]

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const isActive = (href: string) => pathname === href

  const NavItemButton = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-2 px-3 text-gray-300 hover:bg-gray-800 hover:text-gray-100",
        isActive(item.href) && "bg-gray-800 text-blue-400",
        collapsed && "justify-center"
      )}
    >
      {item.icon}
      {!collapsed && <span className="ml-3">{item.name}</span>}
    </Button>
  )

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-semibold text-gray-100"
            >
              Dashboard
            </motion.span>
          )}
        </AnimatePresence>
        {!isMobile && (
          <Button
            onClick={toggleCollapse}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-100"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-2 px-3">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative mb-4"
              >
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input placeholder="Search" className="pl-8 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
          {navItems.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} passHref>
                    <NavItemButton item={item} collapsed={collapsed} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <Separator className="my-2 bg-gray-700" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start py-2 px-3 text-gray-300 hover:bg-gray-800 hover:text-gray-100",
                  collapsed && "justify-center"
                )}
                onClick={() => {
                  router.push('/login')
                }}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Logout</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} passHref>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "text-gray-300 hover:text-gray-100",
                        isActive(item.href) && "text-blue-400"
                      )}
                    >
                      {item.icon}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">{item.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-gray-900 text-gray-100">
              <SheetHeader>
                <SheetTitle className="text-gray-100">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {navItems.slice(4).map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex flex-col items-center justify-center py-2 px-3 text-gray-300 hover:bg-gray-800 hover:text-gray-100",
                        isActive(item.href) && "bg-gray-800 text-blue-400"
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