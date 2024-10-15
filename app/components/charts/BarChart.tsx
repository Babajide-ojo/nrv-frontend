import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  options: ChartOptions<'line'>;  // Change 'line' to the appropriate type if needed
  data: ChartData<'line'>;         // Change 'line' to the appropriate type if needed
}

const BarChart: React.FC<BarChartProps> = ({ options, data }) => {
  return (
    <div style={{ height: '300px', borderRadius: '10px' }} className="border-1 mt-8 border-gray-100 p-4">
      <Line options={options} data={data} />
    </div>
  );
};

export default BarChart;
