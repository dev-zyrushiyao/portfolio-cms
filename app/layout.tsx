import type { Metadata } from "next";
import { Google_Sans_Flex, Lora } from "next/font/google";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";
import { Toaster } from "sonner";

const lora = Lora({
  variable: "--font-lora-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Portfolio CMS",
  description: "Zyrus Hiyao Portfolio Content Management System",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${googleSansFlex.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
