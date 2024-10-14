'use client'

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/providers/Wallet';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package2, LayoutDashboard, Wallet, History, LogOut, Settings, File, Database, User, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
    onCollapse?: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

export default function Sidebar({ onCollapse }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { account, handleLogin, handleLogout }:any = useWallet() || {};
    const router = useRouter();
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { name: 'Overview', href: '/dashboard/overview', icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: 'Pools', href: '/dashboard/pool', icon: <Package2 className="h-5 w-5" /> },
        { name: 'Holdings', href: '/holdings', icon: <Wallet className="h-5 w-5" /> },
        { name: 'Transactions', href: '/transactions', icon: <History className="h-5 w-5" /> },
        { name: 'Staking', href: '/staking', icon: <Database className="h-5 w-5" /> },
        { name: 'APIs', href: '/apis', icon: <Settings className="h-5 w-5" /> },
        { name: 'Documentation', href: '/docs', icon: <File className="h-5 w-5" /> },
        { name: 'Account', href: '/account', icon: <User className="h-5 w-5" /> },
    ];

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 3)}...${address.slice(-6)}`;
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
        if (onCollapse) {
            onCollapse();
        }
    };

    const handleSearch = (query: string) => {
        // Implement search functionality
        console.log('Search query:', query);
    };

    const isActive = (href: string) => pathname === href;

    return (
        <div className={`bg-gray-900 border-r border-gray-800 flex flex-col h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-between px-4 py-4">
                {!collapsed && <span className="px-6 text-xl font-bold text-white">Dashboard</span>}
                <Button onClick={toggleCollapse} variant="ghost" size="icon" className="text-white">
                    {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                </Button>
            </div>
            <div className="flex flex-col justify-between flex-grow overflow-y-auto">
                <div className="space-y-2 px-2">
                    {!collapsed && (
                        <div className="px-6 mb-4">
                            <SearchBar handleSearch={handleSearch} />
                        </div>
                    )}
                    {account ? (
                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start py-6 px-6 text-white">
                            <Wallet className="h-5 w-5 mr-2" />
                            {!collapsed && <span className="truncate ml-4">{truncateAddress(account)}</span>}
                        </Button>
                    ) : (
                        <Button onClick={handleLogin} variant="ghost" className="w-full justify-start py-6 px-6 text-white">
                            <Wallet className="h-5 w-5 mr-2" />
                            {!collapsed && <span className="ml-4">Connect Wallet</span>}
                        </Button>
                    )}
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} passHref>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start py-6 px-6 text-white ${
                                    isActive(item.href) ? 'bg-gray-800' : ''
                                }`}
                            >
                                {item.icon}
                                {!collapsed && <span className="ml-6">{item.name}</span>}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="mt-auto px-6 py-4">
                    <Separator className="my-2" />
                    <Button
                        variant="ghost"
                        className="w-full justify-start py-6 px-6 text-white"
                        onClick={() => {
                            handleLogout();
                            router.push('/login');
                        }}
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        </div>
    );
}