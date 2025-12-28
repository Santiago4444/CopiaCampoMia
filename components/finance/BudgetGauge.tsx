import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface BudgetGaugeProps {
    value: number; // Actual value (e.g. 45 USD/ha)
    max: number;   // Budget value (e.g. 100 USD/ha)
    label: string; // "Herbicidas"
    unit?: string; // "USD/ha"
}

export const BudgetGauge: React.FC<BudgetGaugeProps> = ({ value, max, label, unit = 'USD/ha' }) => {
    // Safety check div by zero
    const budget = max <= 0 ? (value > 0 ? value : 100) : max;
    const percentage = Math.min((value / budget) * 100, 100);
    const isOverBudget = value > budget;

    const data = [
        { name: 'Ejecutado', value: percentage },
        { name: 'Disponible', value: 100 - percentage }
    ];

    // Colors
    let executedColor = '#22c55e'; // Green
    if (percentage > 80) executedColor = '#fab005'; // Yellow
    if (percentage >= 100) executedColor = '#ef4444'; // Red

    const emptyColor = '#e5e7eb'; // Gray 200

    return (
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 text-center h-8 flex items-center">{label}</h3>
            <div className="relative mb-2">
                <PieChart width={160} height={90}>
                    <Pie
                        data={data}
                        cx={80}
                        cy={80}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        <Cell key="cell-0" fill={executedColor} />
                        <Cell key="cell-1" fill={emptyColor} />
                    </Pie>
                </PieChart>
                <div className="absolute top-[45px] left-0 right-0 text-center flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${isOverBudget ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'}`}>
                        {Math.round(percentage)}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">EJECUTADO</span>
                </div>
            </div>

            <div className="text-center mt-[-10px]">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    ${Math.round(value).toLocaleString()}
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-400">${Math.round(budget).toLocaleString()}</span>
                </div>
                {isOverBudget && (
                    <div className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">Excedido</div>
                )}
            </div>
        </div>
    );
};
