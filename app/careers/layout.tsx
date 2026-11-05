import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Careers",
  "Careers at NaijaRentVerify. See open roles or send a resume for future opportunities.",
  "/careers",
);

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
