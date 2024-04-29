"use client"

import type { Metadata } from "next";
import { Provider } from "react-redux";
import { Inter } from "next/font/google";
import "../globals.css";
import { store } from "@/redux/store";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  </Provider>
  );
}
