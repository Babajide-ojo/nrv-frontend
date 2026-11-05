import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact us",
  "Contact the NaijaRentVerify team for questions about listings, verification, or your account.",
  "/contact-us",
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
