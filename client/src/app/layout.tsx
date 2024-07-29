import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perception",
  description: "Collect feedbacks and share easily over social media",
  openGraph: {
    title: "Perception",
    description: "Collect feedbacks and share easily over social media",
    type: "website",
    locale: "en_US",
    url: "https://perception.ashutoshrath.me",
    images: [
      {
        url: "https://res.cloudinary.com/dhnkuonev/image/upload/v1722158086/Screenshot_2024-07-28_144256_sbny2d.png",
        width: 1200,
        height: 630,
        alt: "Perception",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-grid-zinc-50">
            <div className="bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 p-4">
              <div className="container mx-auto flex flex-row justify-between items-center gap-4 sm:gap-0">
                <Link href="/" className="text-xl font-bold">
                  Perception
                </Link>

                <a
                  href="https://github.com/ashutosh-rath02/perception"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border-2 hover:bg-gray-100 px-4 py-2 rounded-md text-sm sm:text-base"
                >
                  ⭐ Star on GitHub
                </a>
              </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-4">
              {children}
            </main>

            <div className="bg-transparent text-black p-4">
              <div className="container mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <p className="text-sm sm:text-base">
                  &copy; 2024 Perception. All rights reserved.
                </p>
                <div className="">
                  <a
                    href="https://github.com/ashutosh-rath02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-800"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://linkedin.com/in/rathashutosh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-800"
                  >
                    LinkedIn
                  </a>

                  <a
                    href="https://twitter.com/v_ashu_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-800"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
