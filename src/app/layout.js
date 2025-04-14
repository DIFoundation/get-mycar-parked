import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { CurrencyProvider } from "@/contexts/currency-context";
import CurrencySelector from "@/components/currency/currency-selector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "🚗Get MyCar Parked",
  description: "Park you car in a saver place by paying a token.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <CurrencyProvider>
          <CurrencySelector/>
          <ThemeToggle />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
