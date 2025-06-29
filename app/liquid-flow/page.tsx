import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, CloudUpload, LockKeyhole, Server, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface Tier {
    name: string;
    id: string;
    href: string;
    priceMonthly: string;
    mostPopular: boolean;
  }
  
  interface FeatureTier {
    [key: string]: boolean | string;
  }
  
  interface Feature {
    name: string;
    tiers: FeatureTier;
  }
  
  interface Section {
    name: string;
    features: Feature[];
  }

const features = [
  {
    name: 'In-depth',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudUpload,
  },
  {
    name: 'Real-time data',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockKeyhole,
  },
  {
    name: 'Historical data',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: Server,
  },
]

const tiers: Tier[] = [
    { name: 'Starter', id: 'tier-starter', href: '#', priceMonthly: 'Free', mostPopular: false },
    { name: 'Growth', id: 'tier-growth', href: '#', priceMonthly: '$49', mostPopular: true },
    { name: 'Scale', id: 'tier-scale', href: '#', priceMonthly: '$99', mostPopular: false },
]

const sections: Section[] = [
    {
      name: 'Features',
      features: [
        { name: 'Historical Data', tiers: { Starter: true, Growth: true, Scale: true } },
        { name: 'Real-time', tiers: { Starter: false, Growth: '10,000 request / month', Scale: '30,000 request / month' } },
        { name: 'Advanced Analytics', tiers: { Starter: false, Growth: true, Scale: true } },
        { name: 'Support', tiers: { Starter: 'email', Growth: 'email', Scale: 'email' } },
      ],
    },
  ]

export default function LandingPage() {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <DetailedPricingSection />
      <CtaSection />
    </div>
  )
}

function HeroSection() {
  return (
    <div className="mx-auto max-w-8xl py-8 sm:px-6 sm:py-8 lg:px-24">
      <div className="relative isolate overflow-hidden bg-white px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        >
          <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Liquid-Flow 
            <br />
            Start using our
            <br />
           API today for free.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get XRPL data for free. Get Historical data, Realtime and crucial data as a developer or Liquidity Provider.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Input></Input>
            <Button asChild>
              <Link href="#">Get your FREE API token</Link>
            </Button>
            <Button variant="link" className="text-gray-900" asChild>
              <Link href="#">
                Learn more <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mt-16 h-80 lg:mt-8">
          <Image
            alt="App screenshot"
            src="/Screenshot 2024-10-06 at 20.13.33.png"
            width={1824}
            height={1080}
            className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <div className="overflow-hidden bg-black py-2 sm:py-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-white">Liquid-flow v0</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Higher insights</p>
              <p className="mt-6 text-lg leading-8 ext-gray-300">
                Liquid exists to contribute to better market efficiencies within XRPL ecosystem. We add value to network participants. 
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-white" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline text-gray-300">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/placeholder.svg?height=1442&width=2432"
            alt="Product screenshot"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-muted sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}

function DetailedPricingSection() {
    return (
        <div className="bg-black py-16 sm:py-16"> {/* Changed to bg-black */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-white">Pricing</h2> {/* Changed to white */}
                    <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Pricing Plans 
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-400"> {/* Adjusted text color */}
                    
                </p>

                {/* xs to lg */}
                <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.id}
                            className={cn(
                                tier.mostPopular ? 'ring-2 ring-primary' : 'ring-1 ring-gray-600', // Updated muted color
                                'rounded-3xl p-8 bg-gray-800' // Set card background to a darker shade
                            )}
                        >
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold leading-6 text-white">{tier.name}</CardTitle> {/* Changed to white */}
                            </CardHeader>
                            <CardContent>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-4xl font-bold tracking-tight text-white">{tier.priceMonthly}</span> {/* Changed to white */}
                                    <span className="text-sm font-semibold text-gray-400">/month</span> {/* Adjusted text color */}
                                </p>
                                <Button
                                    variant={tier.mostPopular ? "default" : "outline"}
                                    className={cn("mt-6 w-full", tier.mostPopular && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90")}
                                    asChild
                                >
                                    <Link href={tier.href}>Buy plan</Link>
                                </Button>
                                <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-400"> {/* Adjusted text color */}
                                    {sections.map((section) => (
                                        <li key={section.name}>
                                            <ul role="list" className="space-y-4">
                                                {section.features.map((feature) =>
                                                    feature.tiers[tier.name] ? (
                                                        <li key={feature.name} className="flex gap-x-3">
                                                            <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                                            <span>
                                                                {feature.name}{' '}
                                                                {typeof feature.tiers[tier.name] === 'string' ? (
                                                                    <span className="text-sm leading-6 text-gray-500">({feature.tiers[tier.name]})</span>
                                                                ) : null}
                                                            </span>
                                                        </li>
                                                    ) : null
                                                )}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* lg+ */}
                <div className="isolate mt-20 hidden lg:block">
                    <div className="relative -mx-8">
                        {tiers.some((tier) => tier.mostPopular) ? (
                            <div className="absolute inset-x-4 inset-y-0 -z-10 flex">
                                <div
                                    className="flex w-1/4 px-4"
                                    style={{ marginLeft: `${(tiers.findIndex((tier) => tier.mostPopular) + 1) * 25}%` }}
                                    aria-hidden="true"
                                >
                                    <div className="w-full rounded-t-xl border-x border-t border-gray-900/10 bg-gray-400/5" />
                                </div>
                            </div>
                        ) : null}
                        <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                            <caption className="sr-only">Pricing plan comparison</caption>
                            <colgroup>
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <td />
                                    {tiers.map((tier) => (
                                        <th key={tier.id} scope="col" className="px-6 pt-6 xl:px-8 xl:pt-8">
                                            <div className="text-sm font-semibold leading-7 text-white">{tier.name}</div> {/* Changed to white */}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <span className="sr-only">Price</span>
                                    </th>
                                    {tiers.map((tier) => (
                                        <td key={tier.id} className="px-6 pt-2 xl:px-8">
                                            <div className="flex items-baseline gap-x-1 text-gray-400"> {/* Adjusted text color */}
                                                <span className="text-4xl font-bold text-white">{tier.priceMonthly}</span> {/* Changed to white */}
                                                <span className="text-sm font-semibold leading-6">/month</span>
                                            </div>
                                            <Button
                                                variant={tier.mostPopular ? "default" : "outline"}
                                                className={cn("mt-8 w-full", tier.mostPopular && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90")}
                                                asChild
                                            >
                                                <Link href={tier.href}>Buy plan</Link>
                                            </Button>
                                        </td>
                                    ))}
                                </tr>
                                {sections.map((section, sectionIdx) => (
                                    <React.Fragment key={section.name}>
                                        <tr>
                                            <th
                                                scope="colgroup"
                                                colSpan={4}
                                                className={cn(
                                                    sectionIdx === 0 ? 'pt-8' : 'pt-16',
                                                    'pb-4 text-sm font-semibold leading-6 text-white' // Changed to white
                                                )}
                                            >
                                                {section.name}
                                                <div className="absolute inset-x-8 mt-4 h-px bg-gray-900/10" />
                                            </th>
                                        </tr>
                                        {section.features.map((feature) => (
                                            <tr key={feature.name}>
                                                <th scope="row" className="py-4 text-sm font-normal leading-6 text-white"> {/* Changed to white */}
                                                    {feature.name}
                                                    <div className="absolute inset-x-8 mt-4 h-px bg-gray-900/5" />
                                                </th>
                                                {tiers.map((tier) => (
                                                    <td key={tier.id} className="px-6 py-4 xl:px-8">
                                                        {typeof feature.tiers[tier.name] === 'string' ? (
                                                            <div className="text-center text-sm leading-6 text-gray-400">
                                                                {feature.tiers[tier.name] as string}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {feature.tiers[tier.name] === true ? (
                                                                    <Check className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
                                                                ) : (
                                                                    <Minus className="mx-auto h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                )}
                                                                <span className="sr-only">
                                                                    {feature.tiers[tier.name] === true ? 'Included' : 'Not included'} in {tier.name}
                                                                </span>
                                                            </>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}


function CtaSection() {
  return (
    <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Boost your productivity today.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur
          commodo do ea.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="#">Get started</Link>
          </Button>
          <Button variant="link" className="text-gray-900" asChild>
            <Link href="#">
              Learn more <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        >
          <circle r={512} cx={512} cy={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}