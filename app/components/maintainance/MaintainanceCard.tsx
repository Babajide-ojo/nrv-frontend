"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Wrench,
} from "lucide-react";

interface MaintenanceCardProps {
  title: string;
  description: string;
  dateLogged: string;
  status: string;
  id: string;
  type: string;
  maintenanceId?: number;
  priority?: string;
  file?: string;
  apartmentId?: string;
  unitNumber?: string | number;
  apartmentName?: string;
  address?: string;
  name?: string;
}

const statusClasses: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Acknowledged: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "In Progress": "bg-violet-50 text-violet-700 ring-violet-600/20",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Declined: "bg-red-50 text-red-700 ring-red-600/20",
};

const priorityClasses: Record<string, string> = {
  Low: "text-gray-600",
  Medium: "text-amber-700",
  High: "text-orange-700",
  Emergency: "text-red-700",
};

const formatDisplayDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const MaintainanceCard: React.FC<MaintenanceCardProps> = ({
  title,
  description,
  dateLogged,
  status,
  type,
  id,
  maintenanceId,
  priority = "Medium",
  file,
  apartmentId,
  unitNumber,
  apartmentName,
  address,
  name,
}) => {
  const router = useRouter();

  const handleOpenRequest = () => {
    if (type === "tenant") {
      router.push(
        `/dashboard/tenant/rented-properties/maintenance/single/${id}`,
      );
      return;
    }
    router.push(`/dashboard/landlord/properties/maintenance/${id}`);
  };

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#03442C]/25 hover:shadow-md sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Request #{maintenanceId ?? id.slice(-6).toUpperCase()}
            </p>
            <span
              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                statusClasses[status] ??
                "bg-gray-50 text-gray-700 ring-gray-600/20"
              }`}
            >
              {status}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-gray-900">
            {title}
          </h3>
        </div>
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
          {file ? (
            <Image
              src={file}
              alt={`Evidence for ${title}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Wrench className="h-6 w-6 text-gray-300" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-800">
          <Building2
            className="h-4 w-4 shrink-0 text-[#03442C]"
            aria-hidden="true"
          />
          <span className="truncate">
            {apartmentName || name || "Apartment"}
          </span>
          {unitNumber != null && (
            <span className="shrink-0 font-medium text-gray-500">
              · Unit {unitNumber}
            </span>
          )}
        </div>
        {address && (
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-gray-500">
            <MapPin
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span className="line-clamp-2">{address}</span>
          </p>
        )}
        {apartmentId && type === "tenant" && (
          <button
            type="button"
            onClick={() =>
              router.push(`/dashboard/tenant/properties/${apartmentId}`)
            }
            className="mt-2.5 text-xs font-semibold text-[#03442C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#03442C]/20"
            aria-label={`View ${apartmentName || "apartment"}`}
          >
            View linked apartment
          </button>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDisplayDate(dateLogged)}
          </span>
          <span
            className={`font-semibold ${
              priorityClasses[priority] ?? "text-gray-600"
            }`}
          >
            {priority} priority
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenRequest}
          className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#03442C] transition hover:gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#03442C]/20"
          aria-label={`Open maintenance request ${maintenanceId ?? ""}`}
        >
          View details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

export default MaintainanceCard;
