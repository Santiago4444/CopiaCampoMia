import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../UI';
import { useData } from '../../contexts/DataContext';
import { FileText, Check } from 'lucide-react';

interface ReportWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartGeneration: (selectedFieldIds: string[], recommendation?: string) => void;
    preSelectedCompanyId?: string;
}

export const ReportWizardModal: React.FC<ReportWizardModalProps> = ({
    isOpen,
    onClose,
    onStartGeneration,
    preSelectedCompanyId
}) => {
    const { data, userCompanies } = useData();
    const [step, setStep] = useState(1);

    // Step 1: Company
    const [selectedCompanyId, setSelectedCompanyId] = useState(preSelectedCompanyId || '');

    // Step 2: Fields
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);

    // Step 3: Recommendation (Manual Only)
    const [recommendationText, setRecommendationText] = useState('');

    useEffect(() => {
        if (preSelectedCompanyId) setSelectedCompanyId(preSelectedCompanyId);
    }, [preSelectedCompanyId]);

    // Reset fields when company changes
    useEffect(() => {
        setSelectedFieldIds([]);
    }, [selectedCompanyId]);

    const handleNext = () => setStep(p => p + 1);
    const handleBack = () => setStep(p => p - 1);

    const toggleField = (id: string) => {
        if (selectedFieldIds.includes(id)) {
            setSelectedFieldIds(prev => prev.filter(f => f !== id));
        } else {
            setSelectedFieldIds(prev => [...prev, id]);
        }
    };

    const handleSelectAllFields = () => {
        const companyFields = data.fields.filter(f => f.companyId === selectedCompanyId);
        if (selectedFieldIds.length === companyFields.length) {
            setSelectedFieldIds([]);
        } else {
            setSelectedFieldIds(companyFields.map(f => f.id));
        }
    };

    const companyFields = data.fields.filter(f => f.companyId === selectedCompanyId);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generador de Informe Profesional">
            <div className="space-y-6">

                {/* Steps Indicator */}
                <div className="flex items-center justify-between px-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${step === i ? 'bg-green-600 text-white' : step > i ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}
                            `}>
                                {step > i ? <Check className="w-5 h-5" /> : i}
                            </div>
                            {i < 3 && <div className={`w-12 h-1 mx-2 ${step > i ? 'bg-green-500' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* STEP 1: SELECT COMPANY */}
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            1. Seleccione la Empresa
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                            {userCompanies.map(company => (
                                <button
                                    key={company.id}
                                    onClick={() => setSelectedCompanyId(company.id)}
                                    className={`p-4 rounded-xl border text-left transition-all ${selectedCompanyId === company.id
                                        ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                        : 'border-gray-200 hover:border-green-300'
                                        }`}
                                >
                                    <div className="font-bold text-gray-800">{company.name}</div>
                                    <div className="text-xs text-gray-500">{data.fields.filter(f => f.companyId === company.id).length} campos</div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                variant="primary"
                                disabled={!selectedCompanyId}
                                onClick={handleNext}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: SELECT FIELDS */}
                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                2. Seleccione los Campos a Incluir
                            </label>
                            <button onClick={handleSelectAllFields} className="text-xs text-green-600 font-bold hover:underline">
                                {selectedFieldIds.length === companyFields.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                            {companyFields.map(field => {
                                const isSelected = selectedFieldIds.includes(field.id);
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => toggleField(field.id)}
                                        className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-all ${isSelected
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">{field.name}</div>
                                            <div className="text-xs text-gray-500">{field.hectares} has</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="secondary" onClick={handleBack}>Atrás</Button>
                            <Button
                                variant="primary"
                                disabled={selectedFieldIds.length === 0}
                                onClick={handleNext}
                            >
                                Siguiente ({selectedFieldIds.length})
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TEXT & CONCLUSIONS */}
                {step === 3 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                3. Conclusión y Estrategia
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                className="w-full p-4 border rounded-xl h-60 focus:ring-2 outline-none resize-none dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-green-500"
                                placeholder="Escriba aquí su conclusión profesional..."
                                value={recommendationText}
                                onChange={(e) => setRecommendationText(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="secondary" onClick={handleBack}>Atrás</Button>
                            <Button
                                variant="primary"
                                onClick={() => onStartGeneration(selectedFieldIds, recommendationText)}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg transform hover:scale-105 transition-all"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                GENERAR INFORME FINAL
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
