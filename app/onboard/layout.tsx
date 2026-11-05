import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Onboarding");

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
