import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";

import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Login = () => {
    return (
        <Tabs defaultValue="Login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Login">Login</TabsTrigger>
                <TabsTrigger value="Sign up">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="Login" className="border-gray-400">
                <Card className="bg-slate-800 bg-opacity-70 border-slate-900">
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2 text-white">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center text-white">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input className="text-white" id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <CardDescription className="text-white">
                            Don&apos;t have an account?  
                            <Link
                                href="/"
                                className="ml-auto inline-block text-sm underline ms-2"
                            >
                                Sign up
                            </Link>
                            </CardDescription>
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="Sign up">
            <Card className="bg-slate-800 bg-opacity-50">
                    <CardContent className="space-y-2">
                        <div className="space-y-1 text-white">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-2 text-white">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center text-white">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input className="text-white" id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <CardDescription className="text-white">
                                Already have an account?  
                                <Link
                                href="/"
                                className="ml-auto inline-block text-sm underline"
                                >
                                Login
                                </Link>
                            </CardDescription>
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
  }
  
  export default Login;