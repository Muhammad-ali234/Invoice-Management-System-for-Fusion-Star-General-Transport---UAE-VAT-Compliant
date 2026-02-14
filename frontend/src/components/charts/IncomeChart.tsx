import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatting';

interface IncomeChartProps {
  data: Record<string, number>;
}

/**
 * IncomeChart component
 * Displays monthly income as a bar chart
 */
export function IncomeChart({ data }: IncomeChartProps) {
  // Convert data object to array format for recharts
  const chartData = Object.entries(data).map(([month, amount]) => ({
    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    amount,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Income Trend / Aamadni ka Graph</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: '#333' }}
          />
          <Bar dataKey="amount" fill="#333" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
