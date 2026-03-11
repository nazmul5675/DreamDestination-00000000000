import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Providers from "./providers.jsx";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: {
    default: "DreamDestination | Explore the World",
    template: "%s | DreamDestination"
  },
  description: "Your ultimate guide to exploring the world's most beautiful destinations. Discover hidden gems, plan your budget, and start your next adventure with DreamDestination.",
  keywords: ["travel", "destinations", "vacation", "adventure", "explore", "nature", "beach", "mountain"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}