import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Reset password");

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
