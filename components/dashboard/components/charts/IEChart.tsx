'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@nextui-org/react';
import { useSnapshots } from '../../hooks/useSnapshots';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload[0].value;
    const expense = payload[1].value;
    const profit = income - expense;
    const profitPercentage = ((profit / income) * 100).toFixed(1);
    const isPositive = profit > 0;
    const transactions = payload[0].payload.transactionCount; // Get transaction count from data

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-semibold mb-2">{label}</p>
        <p className="text-emerald-600">Income: ${income.toLocaleString()}</p>
        <p className="text-red-500">Expense: ${expense.toLocaleString()}</p>
        <p className={`font-semibold mt-2 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          Profit: ${profit.toLocaleString()} ({profitPercentage}%)
        </p>
        <p className="text-gray-600 mt-1">Transactions: {transactions}</p>
      </div>
    );
  }
  return null;
};

const IEChart = ({ accountId }: { accountId: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchRecentSnapshots } = useSnapshots();

  useEffect(() => {
    if (accountId) {
      setLoading(true);
      console.log('🎯 [IEChart] Initiating snapshot fetch for account:', accountId);
      fetchRecentSnapshots(accountId)
        .then((snapshots) => {
          console.log('✅ [IEChart] Snapshots fetched successfully:', snapshots);
          const chartData = (snapshots || []).map((snapshot) => ({
            name: new Date(snapshot.year, snapshot.month - 1).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            }),
            Income: snapshot.totalDeposits || 0,
            Expense: snapshot.totalWithdrawals || 0,
            transactionCount: snapshot.transactionCount || 0
          })).reverse();
          setData(chartData);
        })
        .catch(err => {
          console.error('❌ [IEChart] Error fetching snapshots:', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [accountId, fetchRecentSnapshots]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data.length) {
    return <div>No data available for this account</div>;
  }

  return (
    <Card shadow="sm" radius="sm" className="h-full">
      <div className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4">Income & Expenses</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0"
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              tick={{ fill: '#888888' }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide={true} />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
            />
            <Bar 
              dataKey="Income" 
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar 
              dataKey="Expense" 
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default IEChart;
