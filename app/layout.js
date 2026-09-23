import "./globals.css";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import Header from "../components/Header";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: {
    default: "K-Flow",
    template: "%s · K-Flow",
  },
  description: "Kurangi distraksi. Naikkan jam fokus—dengan bukti.",
  applicationName: "K-Flow",
  openGraph: {
    title: "K-Flow",
    description: "Kurangi distraksi. Naikkan jam fokus—dengan bukti.",
    siteName: "K-Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Flow",
    description: "Kurangi distraksi. Naikkan jam fokus—dengan bukti.",
  },
  icons: {
    icon: `${BP}/K-FlowIcon.png`,
  },
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased overflow-x-hidden font-sans`}
      >
        <Header />
        <main className="w-full overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}
