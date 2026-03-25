// Firebase Configuration for AmkyawDev

// Firebase config object - used by the client-side app
const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
    authDomain: "smart-burme-app.firebaseapp.com",
    projectId: "smart-burme-app",
    storageBucket: "smart-burme-app.appspot.com",
    messagingSenderId: "851502425686",
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
}

// Also set as global for browser
if (typeof window !== 'undefined') {
    window.firebaseConfig = firebaseConfig;
}