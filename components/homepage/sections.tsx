import { Button } from "@/components/ui/button";

const Sections = () => {
    return (
        <>
            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
                style={{ backgroundImage: "url('/hero-background.jpg')" }}>
                <h1 className="text-6xl font-extrabold leading-tight">Unlock The Power of Liquidity with Liquid</h1>
                <p className="text-2xl mt-4 max-w-xl">Revolutionizing liquidity management for DeFi, Liquid gives you real-time insights, deep analytics, and tools to dominate the XRPL ecosystem.</p>
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Get Started Now
                </Button>
            </section>

            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
                style={{ backgroundImage: "url('/hero-background.jpg')" }}>
                <h1 className="text-6xl font-extrabold leading-tight">Liquidity Problems Are Overwhelming, But We Fix That.</h1>
                <p className="text-2xl mt-4 max-w-xl">DeFi liquidity is fragmented, volatile, and hard to manage. Liquid brings cutting-edge solutions, consolidating liquidity management with our solutions for maximum efficiency.</p>
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Join The Revolution
                </Button>
            </section>

            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
                style={{ backgroundImage: "url('/hero-background.jpg')" }}>
                <h1 className="text-6xl font-extrabold leading-tight">Market Access data and In-depth analysis of Liquidity Pools</h1>
                <p className="text-2xl mt-4 max-w-xl">Access Market Data and analysis via our API or Liquid SAAS to evaluate Liquidity pools in a snap</p>
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Signup Now
                </Button>
            </section>

            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
                style={{ backgroundImage: "url('/hero-background.jpg')" }}>
                <h1 className="text-6xl font-extrabold leading-tight">Manage Your Pool Assets and Voting Rights</h1>
                <p className="text-2xl mt-4 max-w-xl">Via Liquid you efficiently operate on the XRPL Automated Market Maker with multiple account</p>
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Signup Now
                </Button>
            </section>

            <section id="hero" className="relative bg-cover bg-center h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start"
                style={{ backgroundImage: "url('/hero-background.jpg')" }}>
                <h1 className="text-6xl font-extrabold leading-tight">Liquid-O2 token</h1>
                <p className="text-2xl mt-4 max-w-xl">Liquid-O2 natively encourage LPs to improve market efficiencies on the most efficient and secured DeFi network</p>
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Get it Now
                </Button>
            </section>

            <section id="cta" className="text-center h-screen flex flex-col justify-center scroll-snap-start">
                <h2 className="text-4xl font-bold mb-4">Ready to be part of the Revolution ?</h2>
                <p className="text-lg text-gray-400 mb-6">Join Liquid today and take control of your DeFi investments.</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg">
                Sign Up Now
                </Button>
            </section>
        </>
    )
  }
  
  export default Sections;