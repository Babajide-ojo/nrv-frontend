import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Payment");

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
