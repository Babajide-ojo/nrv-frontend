import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Legal disclaimer",
  "Legal disclaimer for information, verification reports, and listings on NaijaRentVerify.",
  "/legal/disclaimer",
);

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
