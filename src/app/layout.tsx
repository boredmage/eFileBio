import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eFileBOI",
  description: "Streamline Your Compliance Journey With eFileBOI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plus_jakarta_sans.className}>
        <NextTopLoader color="#FBBF24" showSpinner={false} />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
