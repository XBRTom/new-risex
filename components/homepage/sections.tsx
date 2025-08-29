'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp, Zap, Shield, BarChart3, Wallet, Users, Star, ArrowRight, Database, Code2, Target } from "lucide-react";
import { motion } from "framer-motion";

const Sections = () => {
    const features = [
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: "Real-Time Analytics",
            description: "Monitor 6,000+ XRPL pools with live TVL, volume, and APR data"
        },
        {
            icon: <Wallet className="h-8 w-8" />,
            title: "Multi-Wallet Support",
            description: "Connect with Xaman, GemWallet, Ledger, and Crossmark seamlessly"
        },
        {
            icon: <Database className="h-8 w-8" />,
            title: "Advanced Search",
            description: "Find pools instantly with our powerful search and filtering system"
        },
        {
            icon: <Code2 className="h-8 w-8" />,
            title: "Developer APIs",
            description: "Access comprehensive APIs for pool data, analytics, and transactions"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Enterprise Security",
            description: "Bank-grade security with multi-factor authentication and encryption"
        },
        {
            icon: <Target className="h-8 w-8" />,
            title: "Pool Management",
            description: "Deposit, withdraw, and optimize your AMM positions with ease"
        }
    ];

    const pricingPlans = [
        {
            name: "Basic",
            price: "Free",
            period: "forever",
            description: "Perfect for getting started",
            features: [
                "View up to 100 pools",
                "Basic analytics",
                "5 API calls/day",
                "Standard search",
                "Wallet connection"
            ],
            popular: false,
            cta: "Start Free"
        },
        {
            name: "Premium",
            price: "$19.99",
            period: "per month",
            description: "For serious DeFi traders",
            features: [
                "Unlimited pool access",
                "Advanced analytics & charts",
                "10,000 API calls/month",
                "Portfolio tracking",
                "Priority support",
                "Advanced search filters",
                "Real-time alerts"
            ],
            popular: true,
            cta: "Start Premium Trial"
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "per month",
            description: "For teams and businesses",
            features: [
                "Everything in Premium",
                "Unlimited API access",
                "White-label solutions",
                "Custom integrations",
                "Dedicated support",
                "Multi-account management",
                "Advanced reporting"
            ],
            popular: false,
            cta: "Contact Sales"
        }
    ];

    const stats = [
        { value: "6,000+", label: "Active Pools" },
        { value: "$2.1B+", label: "Total TVL" },
        { value: "50K+", label: "Daily Transactions" },
        { value: "99.9%", label: "Uptime" }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-black h-screen flex flex-col justify-center items-start text-left p-10 scroll-snap-start overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-400">
                        🚀 New: Liquid-O2 Token Rewards Now Live!
                    </Badge>
                    <h1 className="text-7xl font-black leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                        Master XRPL
                        <br />Liquidity Pools
                    </h1>
                    <p className="text-2xl mt-4 max-w-2xl text-gray-300 leading-relaxed">
                        The ultimate platform for XRPL DeFi. Track 6,000+ pools, optimize yields, and access enterprise-grade analytics.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg">
                            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 py-4 px-8 rounded-lg text-lg">
                            Watch Demo
                        </Button>
                    </div>
                </motion.div>
                
                {/* Floating gradient orbs */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </section>

            {/* Stats Section */}
            <section className="bg-black py-20 scroll-snap-start">
                <div className="max-w-6xl mx-auto px-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-900 py-20 scroll-snap-start">
                <div className="max-w-6xl mx-auto px-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">Everything You Need for DeFi Success</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Professional-grade tools trusted by thousands of DeFi traders and institutions
                        </p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-gray-800 border-gray-700 h-full hover:border-blue-500/50 transition-all duration-300">
                                    <CardHeader>
                                        <div className="text-blue-400 mb-4">{feature.icon}</div>
                                        <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-400">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-black py-20 scroll-snap-start">
                <div className="max-w-6xl mx-auto px-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">Choose Your Plan</h2>
                        <p className="text-xl text-gray-400">
                            Start free, scale as you grow. Cancel anytime.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative"
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            <Star className="w-3 h-3 mr-1" /> Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <Card className={`h-full ${
                                    plan.popular 
                                        ? 'bg-gradient-to-b from-blue-900/50 to-purple-900/50 border-blue-500' 
                                        : 'bg-gray-900 border-gray-700'
                                } hover:border-blue-500/50 transition-all duration-300`}>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                                        <div className="text-4xl font-bold text-white mt-4">
                                            {plan.price}
                                            <span className="text-lg text-gray-400 font-normal">/{plan.period}</span>
                                        </div>
                                        <CardDescription className="text-gray-400">
                                            {plan.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center text-gray-300">
                                                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button 
                                            className={`w-full ${
                                                plan.popular
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                                            }`}
                                            size="lg"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* API Section */}
            <section className="bg-gray-900 py-20 scroll-snap-start">
                <div className="max-w-6xl mx-auto px-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl font-bold text-white mb-6">Developer-First API</h2>
                            <p className="text-xl text-gray-400 mb-8">
                                Build the next generation of DeFi applications with our comprehensive APIs. 
                                Real-time data, webhooks, and enterprise-grade infrastructure.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <Zap className="h-5 w-5 text-yellow-400 mr-3" />
                                    99.9% uptime guarantee
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Shield className="h-5 w-5 text-green-400 mr-3" />
                                    Enterprise security & compliance
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <TrendingUp className="h-5 w-5 text-blue-400 mr-3" />
                                    Real-time websocket feeds
                                </div>
                            </div>
                            <Button className="mt-8 bg-blue-600 hover:bg-blue-700" size="lg">
                                Explore API Docs
                            </Button>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                        >
                            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Get real-time pool data
const response = await fetch(
  'https://api.liquid.com/v1/pools/XRP-USD'
);

const pool = await response.json();
console.log(pool);

// Output:
{
  "pair": "XRP/USD",
  "tvl": "$2.1M",
  "apr": "12.4%",
  "volume24h": "$890K",
  "fees": "0.25%"
}`}
                            </pre>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-black py-20 text-center scroll-snap-start">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto px-10"
                >
                    <h2 className="text-6xl font-bold text-white mb-6">
                        Ready to Dominate XRPL DeFi?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of traders and developers who trust Liquid for their XRPL liquidity management.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg">
                            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 py-4 px-8 rounded-lg text-lg">
                            Schedule Demo
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </motion.div>
            </section>
        </>
    )
}

export default Sections;
