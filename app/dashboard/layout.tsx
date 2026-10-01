import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Dashboard");

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
