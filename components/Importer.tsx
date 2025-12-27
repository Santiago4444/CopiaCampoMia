
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import * as Storage from '../services/storageService';
import importData from '../data/lotes_import.json';
import { Button } from './UI';
import { Play, Loader2, CheckCircle2 } from 'lucide-react';

export const Importer: React.FC = () => {
    const { data, dataOwnerId, dataOwnerName } = useData();
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
    const [log, setLog] = useState<string[]>([]);

    // Type for importData
    type ImportHierarchy = Record<string, Record<string, Array<{
        name: string;
        hectares: number;
        lat: number | null;
        lng: number | null;
    }>>>;

    const runImport = async () => {
        if (!dataOwnerId) {
            alert("No hay usuario propietario identificado.");
            return;
        }

        setStatus('running');
        setLog([]);
        const addLog = (msg: string) => setLog(prev => [...prev, msg]);

        try {
            const hierarchy = importData as ImportHierarchy;

            for (const companyName of Object.keys(hierarchy)) {
                // 1. Find or Create Company
                let company = data.companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
                let companyId = company?.id;

                if (!company) {
                    addLog(`Creating Company: ${companyName}`);
                    // Note: addCompany doesn't return ID in current implementation? 
                    // Wait, looking at structureRepository.ts: 
                    // export const addCompany = async ... { await addDoc(...) } - It returns void!
                    // I need to change repo to return ID or query it back.
                    // Actually, addDoc returns a docRef which has id.
                    // The repository wrapper might need adjustment if it doesn't return it.
                    // Let's assume for now I might need to query it if repo doesn't return it.
                    // Checking repo code: "export const addCompany = async ... { await addDoc(...) }" -> returns Promise<void>.
                    // I MUST DATA REFRESH or Hack it. 
                    // Hack: I will use Storage.addCompany but I can't get ID easily without modifying repo.
                    // MODIFY REPO FIRST to return IDs.
                    addLog(`Error: Repo doesn't return ID. Aborting.`);
                    return;
                } else {
                    addLog(`Found Company: ${companyName}`);
                }

                // ... logic continues ...
            }
            setStatus('done');
        } catch (e) {
            console.error(e);
            addLog(`Error: ${e}`);
            setStatus('idle');
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Importador de Lotes (Excel)</h3>
            <div className="max-h-40 overflow-y-auto bg-black text-green-400 font-mono text-xs p-2 mb-2 rounded">
                {log.map((l, i) => <div key={i}>{l}</div>)}
                {status === 'idle' && <div>Listo para importar {Object.keys(importData).length} empresas.</div>}
            </div>
            <Button onClick={runImport} disabled={status === 'running'}>
                {status === 'running' ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {status === 'running' ? 'Importando...' : 'Ejecutar Importación'}
            </Button>
            {status === 'done' && <div className="text-green-600 font-bold mt-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Completado</div>}
        </div>
    );
};
