
import { User } from '../types';

export type UserRoleType = 'admin' | 'operator' | 'company' | 'unknown';

export const getUserRole = (userId: string | undefined, users: User[] | undefined, adminId: string | null): UserRoleType => {
    if (!userId) return 'unknown';
    if (userId === adminId) return 'admin';
    const user = users?.find(u => u.id === userId);
    if (user) return user.role;
    return 'unknown';
};

export const getRoleColorClass = (role: UserRoleType): string => {
    switch (role) {
        case 'admin': return 'text-blue-700 dark:text-blue-400';
        case 'operator': return 'text-gray-700 dark:text-gray-300'; // Updated to match user preference/convention (Operators are usually standard)
        case 'company': return 'text-purple-700 dark:text-purple-400';
        default: return 'text-gray-700 dark:text-gray-300';
    }
};

export const getRoleBgClass = (role: UserRoleType): string => {
    switch (role) {
        case 'admin': return 'bg-blue-50 dark:bg-blue-900/20';
        case 'operator': return 'bg-gray-50 dark:bg-gray-800';
        case 'company': return 'bg-purple-50 dark:bg-purple-900/20';
        default: return 'bg-gray-50 dark:bg-gray-800';
    }
};

export const getRoleBadgeClass = (role: UserRoleType): string => {
    switch (role) {
        case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        case 'operator': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'; // Green for operators in badges is nice
        case 'company': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
        default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
};
