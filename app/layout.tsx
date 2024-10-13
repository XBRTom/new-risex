import * as React from "react"
import Script from "next/script";
import { WalletProvider } from "@/providers/Wallet";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";


export default function RootLayout(
  {children,}: Readonly<{
  children: React.ReactNode;
  }>
) 
  
{
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
            var xumm = new Xumm('5ea5cad0-1d8e-4cee-a31e-96a8f2297dea')
      
            xumm.on("ready", () => console.log("Ready (e.g. hide loading state of page)"))
          
            xumm.on("success", async () => {
            xumm.user.account.then(account => {
              console.log(account)
            })
            })

            xumm.on("logout", async () => {
            document.getElementById('accountaddress').innerText = '...'
            })
            `}
          </Script>
          <WalletProvider>
            <Navbar />
           {children}
          </WalletProvider>
        </body>
    </html>
  );
}