import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms of service",
  "Terms of service for using the NaijaRentVerify platform as a landlord, tenant, or visitor.",
  "/legal/terms",
);

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
