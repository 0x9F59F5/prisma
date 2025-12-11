import { Collection } from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb';
import maverickReactivityAdapter from '@signaldb/maverickjs';
import {
    LOCAL_STORAGE_KEY,
    LOCAL_STORAGE_LIBRARY_KEY,
    LOCAL_STORAGE_COLLAB_KEY,
} from '@/constants/app';
import type { AppState, Library, StoredCollabState } from '@/constants/app';

type StoredDocument<T> = {
    id: string;
    data: T;
};

const CANVAS_DOC_ID = 'canvas-state';
const LIBRARY_DOC_ID = 'library-state';
const COLLAB_DOC_ID = 'collab-state';

const canvasPersistence = createIndexedDBAdapter(LOCAL_STORAGE_KEY);
export const CanvasCollection = new Collection<StoredDocument<AppState>>({
    reactivity: maverickReactivityAdapter,
    persistence: canvasPersistence as any,
});

const libraryPersistence = createIndexedDBAdapter(LOCAL_STORAGE_LIBRARY_KEY);
export const LibraryCollection = new Collection<StoredDocument<Library>>({
    reactivity: maverickReactivityAdapter,
    persistence: libraryPersistence as any,
});

const collabPersistence = createIndexedDBAdapter(LOCAL_STORAGE_COLLAB_KEY);
export const CollabCollection = new Collection<StoredDocument<StoredCollabState>>({
    reactivity: maverickReactivityAdapter,
    persistence: collabPersistence as any,
});

let initPromise: Promise<void> | null = null;

const waitForInitialization = async () => {
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        // IndexedDB가 완전히 로드될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('SignalDB Collections initialized');
    })();

    return initPromise;
};

export const canvasDB = {
    get: async (): Promise<AppState | null> => {
        await waitForInitialization();
        const doc = CanvasCollection.findOne({ id: CANVAS_DOC_ID });
        // console.log('canvasDB.get:', doc);
        return doc?.data || null;
    },
    set: async (data: AppState): Promise<void> => {
        await waitForInitialization();
        // console.log('canvasDB.set:', data);
        CanvasCollection.updateOne({ id: CANVAS_DOC_ID }, { $set: { id: CANVAS_DOC_ID, data } }, { upsert: true });
    },
};

export const libraryDB = {
    get: async (): Promise<Library | null> => {
        await waitForInitialization();
        const doc = LibraryCollection.findOne({ id: LIBRARY_DOC_ID });
        // console.log('libraryDB.get:', doc);
        return doc?.data || null;
    },
    set: async (data: Library): Promise<void> => {
        await waitForInitialization();
        // console.log('libraryDB.set:', data);
        LibraryCollection.updateOne({ id: LIBRARY_DOC_ID }, { $set: { id: LIBRARY_DOC_ID, data } }, { upsert: true });
    },
};

export const collabDB = {
    get: async (): Promise<StoredCollabState | null> => {
        await waitForInitialization();
        const doc = CollabCollection.findOne({ id: COLLAB_DOC_ID });
        // console.log('collabDB.get:', doc);
        return doc?.data || null;
    },
    set: async (data: StoredCollabState): Promise<void> => {
        await waitForInitialization();
        // console.log('collabDB.set:', data);
        CollabCollection.updateOne({ id: COLLAB_DOC_ID }, { $set: { id: COLLAB_DOC_ID, data } }, { upsert: true });
    },
};