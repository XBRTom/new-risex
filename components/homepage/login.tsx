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
import { auth } from "@/auth"
import { SignInGoogle, SignInMagicLink, SignOut } from "@/components/homepage/auth"

const Login = async () => {
    const session = await auth()
    if (!session?.user) 
        return <>
                    <Tabs defaultValue="Login" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="Login">Sign In</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Login" className="border-gray-400">
                            <Card className="bg-slate-800 bg-opacity-70 border-slate-900">
                                <CardContent className="grid gap-4">
                                    <SignInMagicLink provider="mailgun" />

                                    <SignInGoogle provider="google" variant="outline" className="w-full" /> 
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
    return (
        <>
            <Card className="bg-slate-800 bg-opacity-70 border-slate-900">
                <CardContent className="grid gap-4">
                    <p className="text-white">Hi 👋, <span className="font-bold">{session.user?.name}</span></p>
                    <SignOut variant="outline" className="w-full" />
                </CardContent>
            </Card>
            
        </>
    )
  }
  
  export default Login;