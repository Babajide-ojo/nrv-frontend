"use client";

import type { Metadata } from "next";
import { Provider } from "react-redux";
import { Inter } from "next/font/google";
import "../globals.css";
import { store } from "@/redux/store";
import Head from "next/head";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <html lang="en" className="h-full">
        <body className={inter.className}>
          <div className="">{children}</div>
        </body>
      </html>
    </Provider>
    </LocalizationProvider>

  );
}
