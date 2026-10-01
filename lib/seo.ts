import type { Metadata } from "next";

export const SITE_URL = "https://www.naijarentverify.com";
export const SITE_NAME = "NaijaRentVerify";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export function privatePageMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
