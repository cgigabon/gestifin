'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { CardTitle } from '@/components/ui/card';
import { scaleIn } from '@/lib/animations';

/**
 * 🥧 GRAPHIQUE EN CAMEMBERT ANIMÉ
 * Avec Framer Motion
 */

interface AnimatedPieChartProps {
  data: any[];
  dataKey?: string;
  nameKey?: string;
  title: string;
  height?: number;
  delay?: number;
  colors?: string[];
  showPercentage?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // orange
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange-2
];

export function AnimatedPieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  title,
  height = 300,
  delay = 0,
  colors = DEFAULT_COLORS,
  showPercentage = false,
}: AnimatedPieChartProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ delay, duration: 0.5 }}
    >
      <CardTitle className="mb-4">{title}</CardTitle>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={showPercentage}
            animationBegin={delay * 1000}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${Math.round(value).toLocaleString('fr-GA')} XAF`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
