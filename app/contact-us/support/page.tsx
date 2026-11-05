"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";
import SupportContactPanel from "@/app/components/support/SupportContactPanel";
import {
  getStoredSession,
  resolveNrvRole,
} from "@/lib/authSession";

const SupportPage = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    const role = resolveNrvRole(session?.user?.accountType);
    if (role === "landlord") {
      router.replace("/dashboard/landlord/support");
      return;
    }
    if (role === "tenant") {
      router.replace("/dashboard/tenant/support");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F8F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#03442C]" />
      </div>
    );
  }

  return (
    <div className="font-jakarta min-h-screen bg-[#F6F8F6]">
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <SupportContactPanel />
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
