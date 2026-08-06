import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaintenanceSummary = (data: any) => {
  console.log({ data });

  return (
    <div className="space-y-12 p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">Maintenance Management</h2>
          <p className="text-gray-500">View and manage your maintenance</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border">
        {[
          {
            title: "Active Requests",
            value: `${data.data.summary.openTickets} Open Tickets`,
            change: "0%",
            trend: "up",
            comparison: "compared to the last 6 months",
          },
          {
            title: "Resolved",
            value: `${data.data.summary.completed} Completed`,
            change: "10%",
            trend: "up",
            comparison: "compared to the last 6 months",
          },
          {
            title: "In Progress (Under Review)",
            value: `${data.data.summary.inProgress} In Progress`,
            change: "83%",
            trend: "up",
            comparison: "compared to the last 6 months",
          },
          {
            title: "Urgent",
            value: `${data.data.summary.emergency} Emergency`,
            change: "10%",
            trend: "down",
            comparison: "compared to the last 6 months",
          },
        ].map((card, i) => (
          <div key={i} className="border-r last:border-none px-4">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h3 className="text-xl font-semibold text-green-900">
              {card.value}
            </h3>
            <p
              className={`text-xs mt-1 ${
                card.trend === "up" ? "text-green-600" : "text-red-500"
              }`}
            >
              {card.trend === "up" ? "↑" : "↓"} {card.change} {card.comparison}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <Button className="bg-green-700 hover:bg-green-800 text-white">
          Active Maintenance <span className="ml-2 font-semibold"></span>
        </Button>
        <Button variant="outline">
          In-Progress <span className="ml-2 font-semibold">15</span>
        </Button>
        <Button variant="outline">
          Completed <span className="ml-2 font-semibold">15</span>
        </Button>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2 mt-2">
        <h4 className="text-lg font-semibold">Recent Maintenance Activities</h4>
        <span className="text-gray-400 text-sm">
          View and manage recent maintenance activities
        </span>
      </div>
    </div>
  );
};

export default MaintenanceSummary;
