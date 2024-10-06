import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <BackgroundPattern />
      <BackgroundGradient />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <Logo />
          <AnnouncementBadge />
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Deploy to the cloud with confidence
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
            fugiat veniam occaecat fugiat aliqua.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg">Get started</Button>
            <Button variant="link" className="text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScreenshotImage />
      </div>
    </div>
  )
}

function BackgroundPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full stroke-muted/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    >
      <defs>
        <pattern
          id="background-pattern"
          width={200}
          height={200}
          x="50%"
          y={-1}
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y={-1} className="overflow-visible fill-muted/20">
        <path
          d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
          strokeWidth={0}
        />
      </svg>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#background-pattern)" />
    </svg>
  )
}

function BackgroundGradient() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
    >
      <div
        className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary to-primary-foreground opacity-20"
        style={{
          clipPath:
            "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
        }}
      />
    </div>
  )
}

function Logo() {
  return (
    <Image
      src="/placeholder.svg?height=44&width=44"
      alt="Your Company"
      className="h-11 w-11"
      width={44}
      height={44}
    />
  )
}

function AnnouncementBadge() {
  return (
    <div className="mt-24 sm:mt-32 lg:mt-16">
      <Link href="#" className="inline-flex items-center space-x-6">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
          What's new
        </span>
        <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
          <span>Just shipped v1.0</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </span>
      </Link>
    </div>
  )
}

function ScreenshotImage() {
  return (
    <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
      <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
        <Image
          src="/placeholder.svg?height=1442&width=2432"
          alt="App screenshot"
          width={2432}
          height={1442}
          className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
        />
      </div>
    </div>
  )
}