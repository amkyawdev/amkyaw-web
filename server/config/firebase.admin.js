// Firebase Admin Configuration for AmkyawDev
// This file is used for server-side Firebase operations

const admin = require('firebase-admin');

// Firebase service account (should be in environment variables in production)
const serviceAccount = {
    type: "service_account",
    project_id: "smart-burme-app",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

// Initialize Firebase Admin
function initializeFirebase() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://smart-burme-app.firebaseio.com",
                storageBucket: "smart-burme-app.appspot.com"
            });
            console.log('Firebase Admin initialized successfully');
        } catch (error) {
            console.error('Firebase Admin initialization error:', error);
        }
    }
    return admin;
}

// Authentication helpers
const auth = {
    // Verify ID token
    async verifyToken(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('Token verification error:', error);
            throw error;
        }
    },

    // Get user by email
    async getUserByEmail(email) {
        try {
            const user = await admin.auth().getUserByEmail(email);
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },

    // Create custom claims
    async setAdminRole(uid) {
        try {
            await admin.auth().setCustomUserClaims(uid, { admin: true });
            console.log('Admin role set for user:', uid);
        } catch (error) {
            console.error('Set admin role error:', error);
            throw error;
        }
    }
};

// Firestore helpers
const db = {
    // Get reference to collection
    collection(name) {
        return admin.firestore().collection(name);
    },

    // Get document
    async getDoc(collectionName, docId) {
        try {
            const doc = await admin.firestore()
                .collection(collectionName)
                .doc(docId)
                .get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Get doc error:', error);
            throw error;
        }
    },

    // Set document
    async setDoc(collectionName, docId, data) {
        try {
            await admin.firestore()
                .collection(collectionName)
                .doc(docId)
                .set(data);
            return { id: docId, ...data };
        } catch (error) {
            console.error('Set doc error:', error);
            throw error;
        }
    },

    // Update document
    async updateDoc(collectionName, docId, data) {
        try {
            await admin.firestore()
                .collection(collectionName)
                .doc(docId)
                .update(data);
            return { id: docId, ...data };
        } catch (error) {
            console.error('Update doc error:', error);
            throw error;
        }
    },

    // Delete document
    async deleteDoc(collectionName, docId) {
        try {
            await admin.firestore()
                .collection(collectionName)
                .doc(docId)
                .delete();
            return true;
        } catch (error) {
            console.error('Delete doc error:', error);
            throw error;
        }
    }
};

// Storage helpers
const storage = {
    // Get bucket
    getBucket() {
        return admin.storage().bucket();
    },

    // Upload file
    async uploadFile(filePath, destination) {
        try {
            await admin.storage()
                .bucket()
                .upload(filePath, {
                    destination
                });
            return destination;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
};

// Initialize on module load
initializeFirebase();

// Export
module.exports = {
    admin,
    auth,
    db,
    storage,
    initializeFirebase
};