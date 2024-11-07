import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chartData } from './data';

const IEChart = () => {
  return (
    <div className="min-w-full py-3 px-0.5">
      <h1>Chart</h1>
      <ResponsiveContainer width="100%" height={300}>  {/* Set a fixed height */}
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" />
          <YAxis tick={false}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#6EC207" strokeWidth={3} dot={false}/>
          <Line type="monotone" dataKey="Expense" stroke="#FF4545" strokeWidth={3} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IEChart;
