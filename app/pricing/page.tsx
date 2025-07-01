'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Zap, Users, Building, Code, BarChart3, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            period: "forever",
            description: "Perfect for getting started with XRPL DeFi",
            features: [
                "View up to 100 pools",
                "Basic pool analytics",
                "5 API calls per day",
                "Standard search functionality",
                "Wallet connection (Xaman, GemWallet)",
                "Community support"
            ],
            icon: <Wallet className="h-6 w-6" />,
            popular: false,
            cta: "Start Free",
            color: "gray"
        },
        {
            name: "Premium",
            price: "$19.99",
            period: "per month",
            description: "For serious DeFi traders and analysts",
            features: [
                "Unlimited pool access (6,000+ pools)",
                "Advanced analytics & charts",
                "10,000 API calls per month",
                "Portfolio tracking & alerts",
                "Priority email support",
                "Advanced search filters",
                "Real-time notifications",
                "Export data (CSV, JSON)",
                "Mobile app access"
            ],
            icon: <BarChart3 className="h-6 w-6" />,
            popular: true,
            cta: "Start 14-Day Free Trial",
            color: "blue"
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "per month",
            description: "For teams, institutions, and businesses",
            features: [
                "Everything in Premium",
                "Unlimited API access",
                "White-label solutions",
                "Custom integrations",
                "Dedicated account manager",
                "Multi-account management",
                "Advanced reporting & analytics",
                "99.9% SLA guarantee",
                "Priority phone support",
                "Custom webhooks"
            ],
            icon: <Building className="h-6 w-6" />,
            popular: false,
            cta: "Contact Sales",
            color: "purple"
        }
    ]

    const apiServices = [
        {
            name: "Pool Data API",
            price: "$0.001",
            unit: "per request",
            description: "Access comprehensive pool information including TVL, volume, fees, and more",
            features: ["Real-time pool data", "Historical metrics", "Pool composition", "Fee structures"]
        },
        {
            name: "Analytics API",
            price: "$0.005",
            unit: "per request", 
            description: "Advanced analytics and calculations for yield optimization and risk assessment",
            features: ["APR calculations", "Risk metrics", "Yield projections", "Trend analysis"]
        },
        {
            name: "Webhook Services",
            price: "$10",
            unit: "per endpoint/month",
            description: "Real-time notifications for pool changes, transactions, and market events",
            features: ["Pool updates", "Price alerts", "Volume triggers", "Custom events"]
        }
    ]

    const addOns = [
        {
            name: "DeFi Academy",
            price: "$297",
            unit: "one-time or $29/month",
            description: "Comprehensive course on XRPL DeFi and liquidity pool management",
            icon: "🎓"
        },
        {
            name: "Pool Management Consulting",
            price: "$500",
            unit: "per session",
            description: "Expert guidance on pool optimization and liquidity strategies",
            icon: "🧠"
        },
        {
            name: "Custom Integration",
            price: "$2,000",
            unit: "per project",
            description: "Bespoke integrations and custom development services",
            icon: "⚙️"
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            LIQUID
                        </span>
                    </Link>
                    <Button asChild>
                        <Link href="/dashboard/overview">Dashboard</Link>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto px-6"
                >
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Pricing That Scales With You
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        From individual traders to enterprise teams, we have the perfect plan for your XRPL DeFi needs.
                    </p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-400">
                        💰 Save 20% with annual billing
                    </Badge>
                </motion.div>
            </section>

            {/* Main Pricing Plans */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
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
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="text-blue-400">{plan.icon}</div>
                                        </div>
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

            {/* API Pricing */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">API Services</h2>
                        <p className="text-xl text-gray-400">
                            Pay-per-use APIs for developers and advanced integrations
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {apiServices.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-gray-800 border-gray-700 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-white">{service.name}</CardTitle>
                                        <div className="text-2xl font-bold text-blue-400">
                                            {service.price}
                                            <span className="text-sm text-gray-400 font-normal"> {service.unit}</span>
                                        </div>
                                        <CardDescription className="text-gray-400">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {service.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                                                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Add-ons and Services */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">Professional Services</h2>
                        <p className="text-xl text-gray-400">
                            Expert guidance and custom solutions for your DeFi journey
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {addOns.map((addon, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-gray-900 border-gray-700 h-full">
                                    <CardHeader className="text-center">
                                        <div className="text-4xl mb-4">{addon.icon}</div>
                                        <CardTitle className="text-white">{addon.name}</CardTitle>
                                        <div className="text-2xl font-bold text-purple-400">
                                            {addon.price}
                                            <span className="text-sm text-gray-400 font-normal block">{addon.unit}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-400 text-center">
                                            {addon.description}
                                        </CardDescription>
                                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                                            Learn More
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                    </motion.div>

                    <div className="space-y-8">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Can I switch plans anytime?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                                    and we'll prorate the billing accordingly.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">What payment methods do you accept?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    We accept all major credit cards, PayPal, and cryptocurrency payments. 
                                    Enterprise customers can also pay via bank transfer.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Is there an API rate limit?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Rate limits vary by plan: Basic (5 requests/day), Premium (10,000/month), 
                                    Enterprise (unlimited). API-only plans are pay-per-use with no monthly limits.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of traders and developers building the future of XRPL DeFi
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            Contact Sales
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
