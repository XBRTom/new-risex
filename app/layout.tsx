import * as React from "react"
import Script from "next/script";
import { WalletProvider } from "@/context";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"

export default async function RootLayout(
  {children,}: Readonly<{
  children: React.ReactNode;
  }>
) 
  
{

  const session = await auth()

  return (
    <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
        </head>
        <body>
          <Script src="https://xumm.app/assets/cdn/xumm.min.js" strategy='beforeInteractive' />
          <Script id='xumm-setup'>
           {`
            if (typeof window !== 'undefined') {
              var xumm = new Xumm('5ea5cad0-1d8e-4cee-a31e-96a8f2297dea')
      
              xumm.on("ready", () => {
                console.log("XUMM Ready - SDK loaded successfully")
                window.xumm = xumm
              })
          
              xumm.on("success", async () => {
                console.log("XUMM Success - User authorized")
                const account = await xumm.user.account
                console.log('Connected account:', account)
              })

              xumm.on("logout", async () => {
                console.log("XUMM Logout - User disconnected")
              })

              xumm.on("error", (error) => {
                console.error("XUMM Error:", error)
              })
            }
            `}
          </Script>
          
          <SessionProvider session={session}>
            <WalletProvider>
              <Navbar />
              {children}
            </WalletProvider>
          </SessionProvider>
        </body>
    </html>
  );
}