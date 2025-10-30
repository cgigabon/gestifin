'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { scaleIn } from '@/lib/animations';

/**
 * 📈 GRAPHIQUE EN LIGNE ANIMÉ
 * Pour visualiser l'évolution des dépenses/revenus dans le temps
 */

interface AnimatedLineChartProps {
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    key: string;
    color: string;
    name?: string;
  }>;
  xAxisKey: string;
  height?: number;
  title?: string;
  formatValue?: (value: number) => string;
}

export function AnimatedLineChart({ 
  data, 
  dataKeys, 
  xAxisKey, 
  height = 300,
  title,
  formatValue = (value) => `${value.toLocaleString('fr-GA')} XAF`
}: AnimatedLineChartProps) {
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      className="w-full"
    >
      {title && (
        <motion.h3 
          className="text-lg font-semibold mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => formatValue(value)}
            labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          
          {dataKeys.map((item, index) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={3}
              name={item.name || item.key}
              dot={{ r: 4, fill: item.color }}
              activeDot={{ r: 6, fill: item.color }}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}


