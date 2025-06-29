import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const description =
  "A login page with two vertically stacked sections. The first section has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second section has a cover image.";

  
const SignUp = () => {
    return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row no-scrollbar">
        {/* First vertical section: Login form */}
        <div 
        className="flex flex-col items-center justify-center py-12 w-full lg:w-1/2 h-screen overflow-y-auto no-scrollbar"
        style={{
          backgroundImage: "url('/astronaut-exploring-a-new-planet-2023-11-27-05-35-27-utc.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        >
          <Tabs defaultValue="Login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Login">Login</TabsTrigger>
              <TabsTrigger value="Sign up">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="Login">
              <Card>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
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
                    <CardDescription className="text-muted-foreground">
                      Don&apos;t have an account?  
                      <Link
                        href="/"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Sign up
                      </Link>
                    </CardDescription>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
              <TabsContent value="Sign up">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Make changes to your account here. Click save when you're done.
                    </CardDescription>
                  </CardHeader> */}
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required />
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
                      <CardDescription className="text-muted-foreground">
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
          </div>
          

        {/* Second vertical section: Cover image */}
        <div className="hidden lg:block bg-muted w-full lg:w-1/2 h-screen overflow-y-auto no-scrollbar">
          <div className="space-y-8 p-8">
            {/* Liquid-Flow Section */}
            <section id="liquid-flow">
              <h2 className="text-2xl font-bold mb-4">Liquid-Flow</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et libero ut leo ullamcorper volutpat nec a urna. Fusce in mauris turpis. Phasellus euismod felis vel ligula feugiat tincidunt.</p>
            </section>

            {/* Liquid-Sync Section */}
            <section id="liquid-sync">
              <h2 className="text-2xl font-bold mb-4">Liquid-Sync</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum malesuada, metus nec laoreet mollis, lectus ipsum pretium dui, sed ultricies ligula ligula et ex.</p>
            </section>

            {/* Liquid-O2 Section */}
            <section id="liquid-o2">
              <h2 className="text-2xl font-bold mb-4">Liquid-O2</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod magna in metus finibus, id tincidunt sapien tristique. Cras volutpat facilisis augue.</p>
            </section>

            {/* Liquid-Pool Section */}
            <section id="liquid-pool">
              <h2 className="text-2xl font-bold mb-4">Liquid-Pool</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a ligula vel augue ullamcorper egestas. Aliquam erat volutpat. Sed vitae posuere lectus.</p>
            </section>

            {/* Liquid-X Section */}
            <section id="liquid-x">
              <h2 className="text-2xl font-bold mb-4">Liquid-X</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut urna non nulla vehicula volutpat vel sed magna. Vivamus fermentum orci sed magna malesuada, at vulputate velit blandit.</p>
            </section>

            {/* Liquid-Labs Section */}
            <section id="liquid-labs">
              <h2 className="text-2xl font-bold mb-4">Liquid-Labs</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed sapien magna. Mauris id dui vehicula, auctor ex vitae, convallis magna.</p>
            </section>
          </div>
        </div>
      </div>
    )
}


export default SignUp;