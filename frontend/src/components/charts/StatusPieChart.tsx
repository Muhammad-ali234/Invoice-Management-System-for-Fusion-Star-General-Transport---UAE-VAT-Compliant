import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getStatusLabel } from '@/utils/formatting';

interface StatusPieChartProps {
  data: {
    draft: number;
    sent: number;
    partially_paid: number;
    paid: number;
  };
}

/**
 * StatusPieChart component
 * Displays invoice status distribution as a pie chart
 */
export function StatusPieChart({ data }: StatusPieChartProps) {
  const COLORS = {
    draft: '#9CA3AF', // gray
    sent: '#3B82F6', // blue
    partially_paid: '#EAB308', // yellow
    paid: '#22C55E', // green
  };

  const chartData = [
    { name: getStatusLabel('draft'), value: data.draft, color: COLORS.draft },
    { name: getStatusLabel('sent'), value: data.sent, color: COLORS.sent },
    { name: getStatusLabel('partially_paid'), value: data.partially_paid, color: COLORS.partially_paid },
    { name: getStatusLabel('paid'), value: data.paid, color: COLORS.paid },
  ].filter((item) => item.value > 0); // Only show non-zero values

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Status / Status</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Status / Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
