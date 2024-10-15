import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  options: ChartOptions<'doughnut'>;  // Specify the type for doughnut chart options
  data: ChartData<'doughnut'>;         // Specify the type for doughnut chart data
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ options, data }) => {
  return (
    <div
      style={{ height: "300px", borderRadius: "10px" }}
      className="border-1 mt-8 border-gray-100 p-4"
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
