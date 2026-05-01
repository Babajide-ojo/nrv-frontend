import { Inter } from "next/font/google";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen">{children}</div>
          <ToastContainer position="top-right" autoClose={4000} />
        </Providers>
      </body>
    </html>
  );
}
