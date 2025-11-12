import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult, Category } from '../types';

interface ChartData extends AnalysisResult {
    name: string;
}

interface AnalysisChartProps {
  data: ChartData[];
  category: Category;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ data, category }) => {
  const sizeLabel = category === Category.Pencils ? 'Length' : 'Height';

  return (
    <div className="w-full h-96 my-8">
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" domain={[0, 10]} allowDecimals={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#2D3748',
                        borderColor: '#4A5568',
                        borderRadius: '0.5rem'
                    }}
                    labelStyle={{ color: '#E2E8F0' }}
                />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                {category === Category.Pencils ? (
                  <Bar dataKey="sharpness" fill="#38B2AC" name="Sharpness" />
                ) : (
                  <>
                    <Bar dataKey="fruitBearing" fill="#F6E05E" name="Fruit Bearing" />
                    <Bar dataKey="greenLeafs" fill="#68D391" name="Green Leafs" />
                  </>
                )}
                <Bar dataKey="size" fill="#81E6D9" name={sizeLabel} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;
