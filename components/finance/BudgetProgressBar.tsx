import React from 'react';

interface BudgetProgressBarProps {
    label: string;
    value: number;
    max: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ label, value, max }) => {
    // Logic for percentage
    const budget = max <= 0 ? (value > 0 ? value : 100) : max; // Prevent div by zero
    const percentage = Math.min((value / budget) * 100, 100);
    const isOverBudget = value > budget && budget > 0;

    // Status Colors
    let barColor = 'bg-emerald-500'; // Green
    if (percentage > 85) barColor = 'bg-yellow-500'; // Warning
    if (percentage >= 100 || isOverBudget) barColor = 'bg-red-500'; // Danger

    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-end mb-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate">{label}</h4>
                <div className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {Math.round(percentage)}%
                </div>
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                    ${Math.round(value).toLocaleString()}
                </span>
                <span className="text-gray-400">
                    / ${Math.round(budget).toLocaleString()}
                </span>
            </div>

            {isOverBudget && (
                <div className="mt-1 text-[10px] text-red-500 font-bold text-right uppercase">Excedido</div>
            )}
        </div>
    );
};
