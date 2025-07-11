"use client";

import type { Metadata } from "next";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { Inter } from "next/font/google";
import "../globals.css";
import { store, persistor } from "@/redux/store";
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
    <html lang="en" className="h-full">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="min-h-screen">{children}</div>
            </LocalizationProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
