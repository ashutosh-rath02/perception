import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeedItBack",
  description: "Collect feedbacks and share easily over social media",
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
              <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                  FeedItBack
                </Link>

                <a
                  href="https://github.com/ashutosh-rath02/feedback"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border-2 hover:bg-gray-100 px-2 py-2 rounded-md"
                >
                  ⭐ Star on GitHub
                </a>
              </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-4">
              {children}
            </main>

            <div className="bg-transparent text-black p-4">
              <div className="container mx-auto text-center flex flex-row items-center justify-between">
                <p>&copy; 2024 FeedItBack. All rights reserved.</p>
                <div className="">
                  <a
                    href="https://github.com/ashutosh-rath02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-300"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://linkedin.com/in/rathashutosh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-300"
                  >
                    LinkedIn
                  </a>

                  <a
                    href="https://twitter.com/v_ashu_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 hover:text-gray-300"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
