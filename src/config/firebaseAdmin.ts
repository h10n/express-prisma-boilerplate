import admin, { ServiceAccount } from 'firebase-admin';
import { ENV } from '@/config/environment';

const serviceAccount: ServiceAccount = {
  projectId: ENV.FIREBASE_PROJECT_ID,
  privateKey: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
};

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
});

export default firebaseAdmin;
