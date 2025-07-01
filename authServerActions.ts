"use server"

import { signIn, signOut } from "@/auth"
import { redirect } from "next/navigation"

export async function handleSignIn(provider?: string, formData?: any) {
  await signIn(provider, {
    ...formData,
    redirectTo: "/dashboard/overview"
  })
}

export async function handleSignOut() {
  await signOut({
    redirectTo: "/"
  })
}
