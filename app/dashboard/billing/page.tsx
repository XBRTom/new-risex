import { Metadata } from "next"
import BillingPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your subscription and payment methods",
}

export default function BillingPage() {
  return <BillingPageClient />
}

