import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Support",
  "Get help from NaijaRentVerify support with your account, a listing, or a verification.",
  "/contact-us/support",
);

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
