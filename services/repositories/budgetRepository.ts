import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Budget } from '../../types/models';

export const cleanUndefined = (obj: any) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach(key => {
        if (newObj[key] === undefined) {
            delete newObj[key];
        }
    });
    return newObj;
};

// BUDGETS
export const saveBudget = async (budget: Budget) => {
    const { id, ...data } = budget;
    // Ensure we don't save undefined values
    const payload = cleanUndefined({
        ...data,
        updatedAt: Date.now()
    });

    if (id && id !== 'new') {
        // Update
        await updateDoc(doc(db, 'budgets', id), payload);
        return id;
    } else {
        // Create
        // First check if one exists for this context
        const q = query(
            collection(db, 'budgets'),
            where('companyId', '==', budget.companyId),
            where('seasonId', '==', budget.seasonId),
            where('cropId', '==', budget.cropId)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            // Update existing if found (fallback)
            const docId = snapshot.docs[0].id;
            await updateDoc(doc(db, 'budgets', docId), payload);
            return docId;
        }

        const docRef = await addDoc(collection(db, 'budgets'), {
            ...payload,
            createdAt: Date.now()
        });
        return docRef.id;
    }
};

export const getBudgets = async (companyId: string, seasonId: string): Promise<Budget[]> => {
    const q = query(
        collection(db, 'budgets'),
        where('companyId', '==', companyId),
        where('seasonId', '==', seasonId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
};

export const deleteBudget = async (id: string) => {
    await deleteDoc(doc(db, 'budgets', id));
};
