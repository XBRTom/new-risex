import * as React from "react"
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
import Link from "next/link"

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Liquid-Flow",
        href: "/docs/primitives/alert-dialog",
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
    return (
        <div className="sticky top-0 z-50 bg-white shadow-md no-scrollbar">
                <NavigationMenu>
                  <NavigationMenuList>
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
                            Why Liquid ? 
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
                                  Join up our forces to improve FinTech
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
                      <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink>
                          docs
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
            </div>
    )
}

export default Navbar