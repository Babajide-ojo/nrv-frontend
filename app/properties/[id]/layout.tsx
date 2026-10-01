import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type PropertyLayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

export function generateMetadata({ params }: PropertyLayoutProps): Metadata {
  return pageMetadata(
    "Property listing",
    "View a rental listing on NaijaRentVerify, including rent, location, and how to apply.",
    `/properties/${params.id}`,
  );
}

export default function PropertyListingLayout({ children }: PropertyLayoutProps) {
  return children;
}
