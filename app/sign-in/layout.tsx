import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Sign in");

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
