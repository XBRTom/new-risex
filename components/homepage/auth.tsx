"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleSignIn, handleSignOut } from "@/authServerActions"
export function SignInGoogle({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSignIn(provider);
  };

  return (
    <>
        <form onSubmit={handleSignInSubmit}>
          <Button {...props}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </form>
    </>
  )
}

export function SignInMagicLink({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    await handleSignIn(provider, formData);
  };

  return (
    <>
        <form
            onSubmit={handleSignInSubmit}
            >
              <div className="grid gap-2 text-white mb-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                  />
              </div>
              <Button {...props} className="w-full">
                Sign In with e-mail
              </Button>
        </form>
    </>
  )
}

export function SignOut({ onSignOut, ...props }: { onSignOut: () => void } & React.ComponentPropsWithRef<typeof Button>) {

  const handleSignOutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const resp = await handleSignOut();
    onSignOut();
    window.location.href = '/';
  };

  return (
    <form
      onSubmit={handleSignOutSubmit}>
      <Button {...props}>
        Sign Out
      </Button>
    </form>
  )
}