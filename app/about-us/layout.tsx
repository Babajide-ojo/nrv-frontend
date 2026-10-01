import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About us",
  "NaijaRentVerify helps Nigerian landlords and tenants verify identity, browse listings, and manage rentals.",
  "/about-us",
);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
