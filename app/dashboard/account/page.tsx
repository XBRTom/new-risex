"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import Loader from '@/components/ui/Loader';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phoneNumber: z.string().optional(),
})

export default function ProfileForm() {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: session?.user?.name || "",
            email: session?.user?.email || "",
            phoneNumber: session?.user?.phoneNumber || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            console.log('Token', session)
            const response = await fetch('/api/account/edit', {
                method: 'POST',
                body: JSON.stringify({
                    email: values.email,
                    fullName: values.fullName,
                    phoneNumber: values.phoneNumber
                })
            })
            const data = await response.json()
            if (data.message) {
                console.error('Error:', data.message);
            } else {
                console.log('Success:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="container p-6 bg-black text-white h-screen">
                <Card className="w-1/2 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-white">Edit your account</CardTitle>
                    </CardHeader>
                    <CardContent className="text-white">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="John Doe" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormDescription>
                                    This is your full name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input placeholder="email@example.com" {...field} disabled />
                                    </FormControl>
                                    <FormDescription>
                                    This is your email address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                    <Input placeholder="123-456-7890" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormDescription>
                                    This is your phone number.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader size={16} className="mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Profile"
                                )}
                            </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
