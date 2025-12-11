import { safeJSONParse } from './object';
import { LOCAL_STORAGE_THEME_KEY } from '@/constants/app';
import { canvasDB, libraryDB, collabDB } from './collections';
import type { AppState, Library, StoredCollabState } from '@/constants/app';

export const localStorageSync = {
    set: <T>(key: string, value: T) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Empty
        }
    },
    get: <T>(key: string) => {
        if (!key) {
            throw new Error('Key must be provided');
        }

        const item = window.localStorage.getItem(key);

        return item ? (safeJSONParse(item) as T) : null;
    },
};

export const storage = {
    set: async <T>(key: string, value: T): Promise<void> => {
        if (key === LOCAL_STORAGE_THEME_KEY) {
            localStorageSync.set(key, value);
            return;
        }

        const { LOCAL_STORAGE_KEY, LOCAL_STORAGE_LIBRARY_KEY, LOCAL_STORAGE_COLLAB_KEY } = await import('@/constants/app');

        if (key === LOCAL_STORAGE_KEY) {
            await canvasDB.set(value as AppState);
        } else if (key === LOCAL_STORAGE_LIBRARY_KEY) {
            await libraryDB.set(value as Library);
        } else if (key === LOCAL_STORAGE_COLLAB_KEY) {
            await collabDB.set(value as StoredCollabState);
        }
    },

    get: async <T>(key: string): Promise<T | null> => {
        if (!key) {
            throw new Error('Key must be provided');
        }

        if (key === LOCAL_STORAGE_THEME_KEY) {
            return localStorageSync.get<T>(key);
        }

        const { LOCAL_STORAGE_KEY, LOCAL_STORAGE_LIBRARY_KEY, LOCAL_STORAGE_COLLAB_KEY } = await import('@/constants/app');

        if (key === LOCAL_STORAGE_KEY) {
            return (await canvasDB.get()) as T | null;
        } else if (key === LOCAL_STORAGE_LIBRARY_KEY) {
            return (await libraryDB.get()) as T | null;
        } else if (key === LOCAL_STORAGE_COLLAB_KEY) {
            return (await collabDB.get()) as T | null;
        }

        return null;
    },
};