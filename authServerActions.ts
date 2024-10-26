"use server"

import { signIn, signOut } from "@/auth"

export async function handleSignIn(provider?: string, formData?: any) {
  await signIn(provider, formData)
}

export async function handleSignOut() {
  await signOut()
}