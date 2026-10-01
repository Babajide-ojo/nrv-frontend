import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Data processing policy",
  "How NaijaRentVerify processes personal data as a controller and when handling data for users.",
  "/legal/data-processing",
);

export default function DataProcessingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
