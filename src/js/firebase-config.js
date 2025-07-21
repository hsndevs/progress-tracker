// Firebase configuration
// This configuration will use environment variables if available (for builds)
// or fallback to hardcoded values (for development)

const firebaseConfig = {
	apiKey: window.FIREBASE_API_KEY || "AIzaSyCOm7TfHNcR86StySj6ndHHJdC3C0WcNaE",
	authDomain: window.FIREBASE_AUTH_DOMAIN || "progress-tracker-4807a.firebaseapp.com",
	databaseURL: window.FIREBASE_DATABASE_URL || "https://progress-tracker-4807a-default-rtdb.firebaseio.com",
	projectId: window.FIREBASE_PROJECT_ID || "progress-tracker-4807a",
	storageBucket: window.FIREBASE_STORAGE_BUCKET || "progress-tracker-4807a.appspot.com",
	messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "413510205582",
	appId: window.FIREBASE_APP_ID || "1:413510205582:web:5170b355b35cba4d8309df",
	measurementId: window.FIREBASE_MEASUREMENT_ID || "G-LG5ENCB3WN"
};

// Export the configuration
window.firebaseConfig = firebaseConfig;
