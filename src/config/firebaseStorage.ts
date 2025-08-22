import { getStorage } from 'firebase-admin/storage';
import firebaseAdmin from './firebaseAdmin';

export const storage = getStorage(firebaseAdmin);
export const bucket = storage.bucket();
