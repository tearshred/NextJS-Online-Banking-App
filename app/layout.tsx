import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { Provider } from 'react-redux';
import store from '../app/store/store'; 

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
// import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";

// Initialize the font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F7F8" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light"  }}>
          <div className="" >
            <Navbar />
            <main className="container mx-auto max-w-full h-full pt-6 p-1.5 flex-grow min-h-screen"  style={{backgroundColor: "#F5F7F8"}}>
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              
              <p>
                Let's talk - shoot me an&nbsp;
                <a href="mailto:nickmiskelin@gmail.com" className="text-blue-500 hover:underline">
                  email
                </a> | © {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
