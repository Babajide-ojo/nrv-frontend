/**
 * Nigerian mobile MSISDN helpers (client-side preview only).
 * Normalizes common user input to 10-digit national format (no leading 0).
 */

const MTN = new Set([
  "0803", "0806", "0703", "0706", "0810", "0813", "0814", "0816",
  "0903", "0906", "0913", "0916",
]);
const AIRTEL = new Set([
  "0802", "0701", "0708", "0808", "0812", "0901", "0902", "0907", "0912", "0904",
]);
const GLO = new Set([
  "0805", "0807", "0705", "0811", "0815", "0905",
]);
const NMOBILE = new Set([
  "0809", "0817", "0818", "0908", "0909",
]);

export type NgNetworkName = "MTN" | "Airtel" | "Glo" | "9mobile" | "Unknown";

export function normalizeNigerianMobile(input: string): string | null {
  let d = String(input || "").replace(/\D/g, "");
  if (d.startsWith("234")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^[789]\d{9}$/.test(d)) return null;
  return d;
}

export function formatNigerianInternational(digits10: string): string {
  return `+234 ${digits10.slice(0, 3)} ${digits10.slice(3, 6)} ${digits10.slice(6)}`;
}

export function detectNgNetwork(digits10: string): NgNetworkName {
  const prefix = `0${digits10.slice(0, 3)}`;
  if (MTN.has(prefix)) return "MTN";
  if (AIRTEL.has(prefix)) return "Airtel";
  if (GLO.has(prefix)) return "Glo";
  if (NMOBILE.has(prefix)) return "9mobile";
  return "Unknown";
}
