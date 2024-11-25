"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Download, Plus, Check, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import { Badge } from "@/components/ui/badge"

const currentPlan = {
  name: "Basic",
  price: "Free",
  features: ["Basic analytics", "Basic API", "Basic Support", "Basic features"],
  upgrade: 'Downgarde to free plan',
  current: 'Current plan'
}

const premiumPlan = {
  name: "Premium",
  price: "$19.99/month",
  features: ["Advanced analytics", "Advanced API", "Priority Support", "Unlimited features"],
  upgrade: 'Upgrade to Premium now',
  current: 'Current plan'
}

const billingHistory = [
  { id: 1, date: "2023-05-01", amount: "$19.99", status: "Paid", invoice: "INV-001" },
  { id: 2, date: "2023-04-01", amount: "$19.99", status: "Paid", invoice: "INV-002" },
  { id: 3, date: "2023-03-01", amount: "$19.99", status: "Paid", invoice: "INV-003" },
]

const paymentMethods = [
  { id: 1, last4: "4242", expiry: "12/24", type: "visa", name: "Jhon Doe" },
  { id: 2, last4: "1234", expiry: "10/25", type: "mastercard", name: "Jhon Doe" },
]

export default function BillingPageClient() {
  const [showAddCard, setShowAddCard] = useState(false)

  const downloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
  }

  const removePaymentMethod = (id: number) => {
    console.log(`Removing payment method ${id}`);
  }

  return (
    <DashboardLayout>
        <div className="p-6 bg-black text-white min-h-screen w-full flex flex-col gap-6">
            <Card className="w-full shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                    <div className="grid gap-8 md:grid-cols-2">
                        <PlanCard plan={currentPlan} current={true} />
                        <PlanCard plan={premiumPlan} current={false} />
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">Billing</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                <Card className="bg-gray-800 text-gray-100">
                        <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription className="text-gray-400">Your recent billing history</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Status</th>
                                <th className="text-left py-2">Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="py-2">{bill.date}</td>
                                    <td className="py-2">{bill.amount}</td>
                                    <td className="py-2">
                                    <span className="px-2 py-1 bg-emerald-900 text-emerald-200 rounded-full text-xs font-medium">
                                        {bill.status}
                                    </span>
                                    </td>
                                    <td className="py-2">
                                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(bill.invoice)} className="text-teal-400 hover:text-teal-300">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            <Card className="w-full shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white">Payment methods</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                <Card className="bg-gray-800 text-gray-100">
                        <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription className="text-gray-400">Manage your payment methods</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {
                                paymentMethods.map(((method, index) => (
                                    <CreditCardDisplay method={method} key={index} />
                                )))
                            }
                        </div>
                        {showAddCard ? (
                            <form className="mt-6 space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            setShowAddCard(false);
                            }}>
                            <div>
                                <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-gray-700 text-gray-100 border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <Label htmlFor="expiry" className="text-gray-300">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" className="bg-gray-700 text-gray-100 border-gray-600" />
                                </div>
                                <div>
                                <Label htmlFor="cvc" className="text-gray-300">CVC</Label>
                                <Input id="cvc" placeholder="123" className="bg-gray-700 text-gray-100 border-gray-600" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="cardholderName" className="text-gray-300">Cardholder Name</Label>
                                <Input id="cardholderName" placeholder="John Doe" className="bg-gray-700 text-gray-100 border-gray-600" />
                            </div>
                            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">Add Card</Button>
                            </form>
                        ) : (
                            <Button onClick={() => setShowAddCard(true)} className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add New Card
                            </Button>
                        )}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    </DashboardLayout>
  )
}

const PlanCard = ({ plan, current }: { plan: typeof currentPlan, current: boolean }) => {
  return (
     <Card className={`flex flex-col justify-between overflow-hidden transition-all duration-300 ${current ? 'border-teal-500 shadow-teal-500/50 shadow-lg' : 'border-gray-700'} bg-gray-800 text-gray-100`}>
      <CardHeader className={`${current ? 'bg-gradient-to-r from-teal-600 to-emerald-600' : 'bg-gray-700'}`}>
        <CardTitle className="text-2xl font-bold">{plan.name} Plan</CardTitle>
        <CardDescription className={`text-2xl font-semibold ${current ? 'text-teal-100' : 'text-gray-300'}`}>
          {plan.price}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-gray-700 p-6">
          {current ? (
            <span className="flex items-center justify-center mx-auto">
              { plan.current }
            </span>
          ) : (
            <Button className="w-full group" variant={current ? "outline" : "default"}>
                <span className="flex items-center justify-center">
                { plan.upgrade }
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
            </Button>
          )}
        
      </CardFooter>
    </Card>
  )
}

const CreditCardDisplay = ({ method }: { method: any }) => {
    const cardBrands: { [key: string]: string } = {
        visa: "linear-gradient(135deg, #4169E1, #00008B)",
        mastercard: "linear-gradient(135deg, #FF8C00, #FF0000)",
        amex: "linear-gradient(135deg, #00CED1, #4169E1)",
        discover: "linear-gradient(135deg, #FF8C00, #FFA500)",
        default: "linear-gradient(135deg, #708090, #2F4F4F)"
    }

    const cardStyle = {
        backgroundImage: cardBrands[method.type || "default"]
    }

    return (
        <motion.div
            className="relative group perspective"
            whileHover={{ rotateY: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div 
                className="p-6 rounded-xl text-white shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-xl transform-style-3d"
                style={cardStyle}
            >
                <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">{method.type.toUpperCase()}</span>
                <CreditCard className="h-8 w-8" />
                </div>
                <div className="mb-4">
                <span className="text-2xl tracking-wider">•••• •••• •••• {method.last4}</span>
                </div>
                <div className="flex justify-between items-center">
                <span>Expires {method.expiry}</span>
                <span className="font-bold uppercase">{method?.name}</span>
                </div>
            </div>
        </motion.div>
    )
}

