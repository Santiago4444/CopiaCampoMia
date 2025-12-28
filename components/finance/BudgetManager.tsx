import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import { Select, Button, Input } from '../UI';
import { Save, AlertTriangle, DollarSign } from 'lucide-react';
import { Budget } from '../../types/models';
import * as BudgetRepo from '../../services/repositories/budgetRepository';
import { getBudgets } from '../../services/repositories/budgetRepository';

export const BudgetManager: React.FC = () => {
    const { data, userCompanies } = useData();
    const { showNotification } = useUI();

    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedSeasonId, setSelectedSeasonId] = useState('');

    // Budgets Map: CropId -> Budget
    const [budgets, setBudgets] = useState<Record<string, Budget>>({});
    const [loading, setLoading] = useState(false);

    // Initialize defaults
    useEffect(() => {
        if (userCompanies.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(userCompanies[0].id);
        }
        const activeSeason = data.seasons.find(s => s.isActive);
        if (activeSeason && !selectedSeasonId) setSelectedSeasonId(activeSeason.id);
    }, [userCompanies, data.seasons]);

    // Fetch Budgets
    useEffect(() => {
        if (!selectedCompanyId || !selectedSeasonId) return;

        const load = async () => {
            setLoading(true);
            try {
                const fetched = await getBudgets(selectedCompanyId, selectedSeasonId);
                const map: Record<string, Budget> = {};
                fetched.forEach(b => map[b.cropId] = b);
                setBudgets(map);
            } catch (error) {
                console.error(error);
                showNotification("Error cargando presupuestos", "error");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedCompanyId, selectedSeasonId]);

    const handleBudgetChange = (cropId: string, field: keyof Budget, value: string) => {
        const numValue = parseFloat(value) || 0;
        setBudgets(prev => ({
            ...prev,
            [cropId]: {
                ...prev[cropId],
                id: prev[cropId]?.id || 'new',
                companyId: selectedCompanyId,
                seasonId: selectedSeasonId,
                cropId,
                [field]: numValue
            }
        }));
    };

    const handleSave = async (cropId: string) => {
        const budget = budgets[cropId];
        if (!budget) return;

        try {
            const savedId = await BudgetRepo.saveBudget(budget);
            setBudgets(prev => ({
                ...prev,
                [cropId]: { ...budget, id: savedId }
            }));
            showNotification("Presupuesto guardado", "success");
        } catch (error) {
            console.error(error);
            showNotification("Error al guardar", "error");
        }
    };

    const categories = [
        { key: 'herbicidas', label: 'Herbicidas', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { key: 'insecticidas', label: 'Insecticidas', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { key: 'fungicidas', label: 'Fungicidas', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { key: 'fertilizantes', label: 'Fertilizantes', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        { key: 'coadyuvantes', label: 'Coadyuvantes', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { key: 'otrosAgroquimicos', label: 'Otros Agro', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { key: 'semillas', label: 'Semillas', bg: 'bg-green-100 dark:bg-green-900/30' },
        { key: 'pulverizacionTerrestre', label: 'Pulv. Terr', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { key: 'pulverizacionSelectiva', label: 'Pulv. Sel', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { key: 'pulverizacionAerea', label: 'Pulv. Aérea', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { key: 'siembra', label: 'Siembra', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { key: 'otrasLabores', label: 'Otras Labores', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    ];

    if (!selectedCompanyId) return <div className="p-8 text-center text-gray-400">Seleccione una empresa</div>;

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-bold">Gestión de Presupuestos (USD/ha)</h2>

                <div className="ml-auto flex gap-2">
                    <Select
                        label=""
                        options={userCompanies.map(c => ({ value: c.id, label: c.name }))}
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-40"
                    />
                    <Select
                        label=""
                        options={data.seasons.map(s => ({ value: s.id, label: s.name }))}
                        value={selectedSeasonId}
                        onChange={(e) => setSelectedSeasonId(e.target.value)}
                        className="w-32"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="w-full text-sm bg-white dark:bg-gray-800 border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="p-3 text-left font-bold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-900 z-20 border-r dark:border-gray-700 w-48">Cultivo</th>

                            {/* Group: Agroquímicos */}
                            <th colSpan={6} className="text-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-x border-gray-200 dark:border-gray-700">AGROQUÍMICOS</th>

                            {/* Group: Fertilizantes */}
                            <th colSpan={2} className="text-center text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-x border-gray-200 dark:border-gray-700">FERTILIZANTES</th>

                            {/* Group: Semillas */}
                            <th colSpan={2} className="text-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 border-x border-gray-200 dark:border-gray-700">SEMILLAS</th>

                            {/* Group: Labores */}
                            <th colSpan={6} className="text-center text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-x border-gray-200 dark:border-gray-700">LABORES</th>

                            <th className="p-3 text-center min-w-[50px] sticky right-0 z-20 bg-gray-50 dark:bg-gray-900 border-l dark:border-gray-700">Acción</th>
                        </tr>
                        <tr className="text-xs">
                            <th className="sticky left-0 bg-gray-50 dark:bg-gray-900 z-20 border-r dark:border-gray-700"></th>

                            {/* Agroquimicos */}
                            <th className="p-2 font-medium bg-yellow-100 dark:bg-yellow-900/30">Herb.</th>
                            <th className="p-2 font-medium bg-yellow-100 dark:bg-yellow-900/30">Insect.</th>
                            <th className="p-2 font-medium bg-yellow-100 dark:bg-yellow-900/30">Fung.</th>
                            <th className="p-2 font-medium bg-yellow-100 dark:bg-yellow-900/30">Coad.</th>
                            <th className="p-2 font-medium bg-yellow-100 dark:bg-yellow-900/30">Otros</th>
                            <th className="p-2 font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-r border-gray-200 dark:border-gray-700">TOTAL</th>

                            {/* Fertilizantes */}
                            <th className="p-2 font-medium bg-orange-100 dark:bg-orange-900/30">Fert.</th>
                            <th className="p-2 font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-r border-gray-200 dark:border-gray-700">TOTAL</th>

                            {/* Semillas */}
                            <th className="p-2 font-medium bg-green-100 dark:bg-green-900/30">Semilla</th>
                            <th className="p-2 font-bold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-r border-gray-200 dark:border-gray-700">TOTAL</th>

                            {/* Labores */}
                            <th className="p-2 font-medium bg-purple-100 dark:bg-purple-900/30">Terr.</th>
                            <th className="p-2 font-medium bg-purple-100 dark:bg-purple-900/30">Sel.</th>
                            <th className="p-2 font-medium bg-purple-100 dark:bg-purple-900/30">Aérea</th>
                            <th className="p-2 font-medium bg-purple-100 dark:bg-purple-900/30">Siembra</th>
                            <th className="p-2 font-medium bg-purple-100 dark:bg-purple-900/30">Otras</th>
                            <th className="p-2 font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-r border-gray-200 dark:border-gray-700">TOTAL</th>

                            <th className="sticky right-0 bg-gray-50 dark:bg-gray-900 z-20 border-l dark:border-gray-700"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.crops.map(crop => {
                            const budget = budgets[crop.id] || {
                                herbicidas: 0, insecticidas: 0, fungicidas: 0, fertilizantes: 0,
                                coadyuvantes: 0, otrosAgroquimicos: 0, semillas: 0,
                                pulverizacionTerrestre: 0, pulverizacionSelectiva: 0, pulverizacionAerea: 0,
                                siembra: 0, otrasLabores: 0
                            };

                            const sumAgro = (budget.herbicidas || 0) + (budget.insecticidas || 0) + (budget.fungicidas || 0) + (budget.coadyuvantes || 0) + (budget.otrosAgroquimicos || 0);
                            const sumFert = (budget.fertilizantes || 0);
                            const sumSeed = (budget.semillas || 0);
                            const sumLabor = (budget.pulverizacionTerrestre || 0) + (budget.pulverizacionSelectiva || 0) + (budget.pulverizacionAerea || 0) + (budget.siembra || 0) + (budget.otrasLabores || 0);
                            const total = sumAgro + sumFert + sumSeed + sumLabor;

                            const InputCell = ({ field }: { field: keyof Budget }) => (
                                <td className="p-1 min-w-[70px]">
                                    <input
                                        type="number"
                                        className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-green-500 rounded text-xs py-1 px-0"
                                        placeholder="0"
                                        value={budget[field] || ''}
                                        onChange={(e) => handleBudgetChange(crop.id, field, e.target.value)}
                                    />
                                </td>
                            );

                            return (
                                <tr key={crop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                    <td className="p-3 font-medium sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 border-r dark:border-gray-700 z-10">
                                        <div className="flex flex-col">
                                            <span>{crop.name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold mt-0.5">Total: ${total.toFixed(0)}</span>
                                        </div>
                                    </td>

                                    {/* Agroquimicos */}
                                    <InputCell field="herbicidas" />
                                    <InputCell field="insecticidas" />
                                    <InputCell field="fungicidas" />
                                    <InputCell field="coadyuvantes" />
                                    <InputCell field="otrosAgroquimicos" />
                                    <td className="p-2 text-center text-xs font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-900/10 border-r border-gray-100 dark:border-gray-700">${sumAgro.toFixed(0)}</td>

                                    {/* Fertilizantes */}
                                    <InputCell field="fertilizantes" />
                                    <td className="p-2 text-center text-xs font-bold text-orange-600 bg-orange-50/50 dark:bg-orange-900/10 border-r border-gray-100 dark:border-gray-700">${sumFert.toFixed(0)}</td>

                                    {/* Semillas */}
                                    <InputCell field="semillas" />
                                    <td className="p-2 text-center text-xs font-bold text-green-600 bg-green-50/50 dark:bg-green-900/10 border-r border-gray-100 dark:border-gray-700">${sumSeed.toFixed(0)}</td>

                                    {/* Labores */}
                                    <InputCell field="pulverizacionTerrestre" />
                                    <InputCell field="pulverizacionSelectiva" />
                                    <InputCell field="pulverizacionAerea" />
                                    <InputCell field="siembra" />
                                    <InputCell field="otrasLabores" />
                                    <td className="p-2 text-center text-xs font-bold text-purple-600 bg-purple-50/50 dark:bg-purple-900/10 border-r border-gray-100 dark:border-gray-700">${sumLabor.toFixed(0)}</td>

                                    <td className="p-2 text-center sticky right-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 z-10 border-l dark:border-gray-700">
                                        <button
                                            onClick={() => handleSave(crop.id)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                            title="Guardar"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-gray-400 text-center">
                * Los valores están expresados en Dólares por Hectárea (USD/ha). Ingrese 0 si no aplica.
            </div>
        </div>
    );
};
