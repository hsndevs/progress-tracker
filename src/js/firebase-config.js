// Firebase configuration
// Replace these values with your actual Firebase project configuration
// You can find these values in your Firebase project settings

const firebaseConfig = {
	apiKey: "AIzaSyCOm7TfHNcR86StySj6ndHHJdC3C0WcNaE",
	authDomain: "progress-tracker-4807a.firebaseapp.com",
	databaseURL: "https://progress-tracker-4807a-default-rtdb.firebaseio.com",
	projectId: "progress-tracker-4807a",
	storageBucket: "progress-tracker-4807a.appspot.com",
	messagingSenderId: "413510205582",
	appId: "1:413510205582:web:5170b355b35cba4d8309df",
	measurementId: "G-LG5ENCB3WN"
};

// Instructions for setting up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Go to Project Settings > General > Your apps
// 4. Click "Add app" and select "Web"
// 5. Register your app and copy the configuration object
// 6. Replace the firebaseConfig object above with your configuration
// 7. Go to Firestore Database and create a database
// 8. Set up security rules for your database

// Export the configuration
window.firebaseConfig = firebaseConfig;
