import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Safety tips",
  "Safety tips for landlords and tenants using NaijaRentVerify, including viewings, payments, and verification.",
  "/legal/safety-tips",
);

export default function SafetyTipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
