import React from 'react';

interface BudgetSummaryProps {
    totalSpent: number;
    totalBudget: number;
    distribution: {
        agrochemicals: number;
        fertilizers: number;
        seeds: number;
        labor: number;
    };
    budgetBreakdown: {
        agrochemicals: number;
        fertilizers: number;
        seeds: number;
        labor: number;
    };
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ totalSpent, totalBudget, distribution, budgetBreakdown }) => {
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const remaining = Math.max(totalBudget - totalSpent, 0);
    const isOver = totalSpent > totalBudget;

    // Calculate percentages for the stacked bar composition
    const totalDist = distribution.agrochemicals + distribution.fertilizers + distribution.seeds + distribution.labor;
    const getPct = (val: number) => totalDist > 0 ? (val / totalDist) * 100 : 0;

    // Helper to render a sub-category row
    const renderSubCategory = (label: string, spent: number, budget: number, color: string) => {
        const pct = budget > 0 ? (spent / budget) * 100 : 0;
        const subIsOver = spent > budget && budget > 0;

        return (
            <div className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{label}</span>
                    <span className="text-gray-500">
                        <span className={`font-bold ${subIsOver ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                            ${Math.round(spent).toLocaleString()}
                        </span>
                        <span className="mx-1">/</span>
                        ${Math.round(budget).toLocaleString()}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${color} ${subIsOver ? 'opacity-100' : 'opacity-80'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row gap-8">

                {/* LEFT: MAIN METRICS */}
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Ejecución Total</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className={`text-5xl font-black ${isOver ? 'text-red-600' : 'text-gray-800 dark:text-white'}`}>
                            ${Math.round(totalSpent).toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 font-medium">
                            / ${Math.round(totalBudget).toLocaleString()}
                        </span>
                    </div>

                    {/* Main Progress Bar */}
                    <div className="relative mb-6">
                        <div className="flex mb-2 items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isOver ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {Math.round(percentage)}% EJECUTADO
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                                Disponible: ${Math.round(remaining).toLocaleString()}
                            </span>
                        </div>
                        <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isOver ? 'bg-red-500' : 'bg-emerald-500'} transition-all duration-1000`}
                            ></div>
                        </div>
                    </div>

                    {/* Stacked Bar Composition */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Distribución
                        </h4>
                        <div className="flex h-2 rounded-full overflow-hidden w-full bg-gray-100 dark:bg-gray-700">
                            <div style={{ width: `${getPct(distribution.agrochemicals)}%` }} className="bg-blue-500 h-full" title="Agroquímicos"></div>
                            <div style={{ width: `${getPct(distribution.fertilizers)}%` }} className="bg-purple-500 h-full" title="Fertilizantes"></div>
                            <div style={{ width: `${getPct(distribution.seeds)}%` }} className="bg-amber-500 h-full" title="Semillas"></div>
                            <div style={{ width: `${getPct(distribution.labor)}%` }} className="bg-slate-500 h-full" title="Labores"></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: DETAILED SUB-TOTALS */}
                <div className="w-full md:w-5/12 md:border-l border-gray-100 dark:border-gray-700 md:pl-8 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Desglose por Rubro
                    </h4>

                    {renderSubCategory(
                        "Agroquímicos",
                        distribution.agrochemicals,
                        budgetBreakdown.agrochemicals,
                        "bg-blue-500"
                    )}
                    {renderSubCategory(
                        "Fertilizantes",
                        distribution.fertilizers,
                        budgetBreakdown.fertilizers,
                        "bg-purple-500"
                    )}
                    {renderSubCategory(
                        "Semillas",
                        distribution.seeds,
                        budgetBreakdown.seeds,
                        "bg-amber-500"
                    )}
                    {renderSubCategory(
                        "Labores",
                        distribution.labor,
                        budgetBreakdown.labor,
                        "bg-slate-500"
                    )}
                </div>
            </div>
        </div>
    );
};
