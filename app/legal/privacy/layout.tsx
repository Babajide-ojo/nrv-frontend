import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy policy",
  "How NaijaRentVerify collects, uses, and protects personal data on the platform.",
  "/legal/privacy",
);

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
