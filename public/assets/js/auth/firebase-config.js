// Firebase Configuration for AmkyawDev
// This file is automatically loaded by the main pages

(function() {
    // Firebase config - loaded from environment or use defaults
    const firebaseConfig = {
        apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
        authDomain: "smart-burme-app.firebaseapp.com",
        projectId: "smart-burme-app",
        storageBucket: "smart-burme-app.appspot.com",
        messagingSenderId: "851502425686",
        appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Export for use in other modules
    window.firebaseConfig = firebaseConfig;
    window.firebaseApp = firebase.apps[0];
    window.firebaseAuth = firebase.auth();
    
    // Export firebase globally for compatibility
    window.firebase = firebase;
})();