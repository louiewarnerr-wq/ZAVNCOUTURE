import "./globals.css";
import type { Metadata } from "next";
import { BRAND } from "./_brand/brand";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CartProvider from "../components/cart/CartProvider";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="topbar">
            <div className="container">
              <Nav />
            </div>
          </div>
          <main>{children}</main>
          <div className="container">
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
