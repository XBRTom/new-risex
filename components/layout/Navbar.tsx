'use client'

import React, { useState } from 'react';
import { useWallet } from '@/providers/Wallet'; // Adjust path based on your project structure
import Modal from '@/components/Modal'; 
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Liquid-Flow",
        href: "/liquid-flow",
        description:
        "Receive real-time, historical and added value data to navigate Blockchain liquidity. Our data services for your need.",
    },
    {
        title: "Liquid-X",
        href: "/docs/primitives/hover-card",
        description:
        "Access in-depth analysis of DeFi liquidity pools to operate and understand what you do",
    },
    {
        title: "Liquid-Sync",
        href: "/docs/primitives/progress",
        description:
        "Synchronize 1 or many wallets to manage everything in one place",
    },
    {
        title: "Liquid-Pool",
        href: "/docs/primitives/scroll-area",
        description: "Access and interact with Liquidity Pools",
    },
    {
        title: "Liquid-O2",
        href: "/docs/primitives/tabs",
        description:
        "Improve market efficiencies with our incentive program",
    },
    {
        title: "Liquid-Labs",
        href: "/docs/primitives/tooltip",
        description:
        "Join us to developed added-value financial technologies and improve the space",
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

const Navbar = () => {
    const { account, handleLogin, handleLogout }:any = useWallet() || {}; // Getting account status and login handler from Wallet provider
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 3)}...${address.slice(-6)}`;
      };

    // const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    // const openModal = () => setIsModalOpen(true);
    // const closeModal = () => setIsModalOpen(false);

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md no-scrollbar flex items-center h-10 px-4 sm:px-6 lg:px-16">
            <div className="w-full flex justify-between items-center">
                <NavigationMenu>
                    <NavigationMenuList className="flex items-center space-x-4">
                        {/* App Name Menu Item */}
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <a
                                    className="flex items-center h-full text-lg font-medium text-gray-900 no-underline"
                                    href="/"
                                >
                                    LIQUID
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Getting Started Menu Item */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                <div className="h-6 w-6" />
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

                        {/* Features Menu Item */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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

                        {/* Partners Menu Item */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Partners</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/"
                                                >
                                                    <div className="h-6 w-6" />
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

                        {/* API Documentation Menu Item */}
                        <NavigationMenuItem className="hidden md:block">
                            <NavigationMenuLink asChild>
                                <a
                                className="flex items-center h-full px-4 text-sm font-medium text-gray-900 no-underline"
                                href="https://protocol.tailwindui.com/"
                                >
                                API documentation
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="hidden md:block">
                            <NavigationMenuLink asChild>
                                <a className="flex items-center h-full px-4 text-sm font-medium text-gray-900 no-underline">not logged
                                <span className="ml-2 h-2 w-2 rounded-full bg-red-600"></span> {/* Red patch */}
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <a className="flex items-center h-full px-4 text-sm font-medium text-gray-900 no-underline">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Account</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        {/* Connect Wallet or Display Account */}
                                        {account ? (
                                        <DropdownMenuItem>
                                            <span className="wallet-address">Wallet : {truncateAddress(account)}</span>
                                            <DropdownMenuShortcut onClick={handleLogout}>Quit</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        
                                        ) : (
                                        <DropdownMenuItem>
                                            <Button onClick={handleLogin}>Connect Wallet</Button>
                                            <DropdownMenuShortcut></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        )}
                                        
                                        {/* Dashboard */}
                                        <DropdownMenuItem>
                                        <a href="/dashboard/overview">Dashboard</a>
                                        <DropdownMenuShortcut></DropdownMenuShortcut>
                                        </DropdownMenuItem>

                                        {/* Billing */}
                                        <DropdownMenuItem>
                                        Billing
                                        <DropdownMenuShortcut></DropdownMenuShortcut>
                                        </DropdownMenuItem>

                                        {/* Settings */}
                                        <DropdownMenuItem>
                                        Settings
                                        <DropdownMenuShortcut></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem disabled>
                                        Reward
                                        <DropdownMenuShortcut>coming soon</DropdownMenuShortcut>
                                        </DropdownMenuItem>

                                        {/* Invite Users Submenu */}
                                        <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                            <DropdownMenuItem>Email</DropdownMenuItem>
                                            <DropdownMenuItem>Message</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>More...</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    {/* Support and API */}
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuItem disabled>API</DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    {/* Log Out */}
                                    <DropdownMenuItem>
                                        Log out
                                        <DropdownMenuShortcut></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                            </DropdownMenu>
                                
                            {/* Blue patch */}
                            <span className="ml-2 h-2 w-2 rounded-full bg-blue-600"></span>
                            </a>
                            </div>

                        {/* Modal for connecting wallet
                            <Modal isOpen={isModalOpen} onClose={closeModal}>
                                <div className="wallet-modal-content">
                                <h2>Connect to Xumm Wallet</h2>
                                <button
                                    onClick={() => {
                                    handleLogin();
                                    closeModal();
                                    }}
                                    className="login-button"
                                >
                                    Connect Wallet
                                </button>
                                </div>
                            </Modal> */}
    </div>
  );
};

export default Navbar;
