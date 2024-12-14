import firebase from "firebase";

let firebaseAppInstance = null;

const firebaseApp = () => {
    if (!firebaseAppInstance) {
        firebaseAppInstance = firebase.initializeApp({
            apiKey: "AIzaSyDaIr4ewkKqBJaCf1MWBuIIPdhTPwrXRJs",
            authDomain: "grkweb-app.firebaseapp.com",
            databaseURL: "https://grkweb-app.firebaseio.com",
            projectId: "grkweb-app",
            storageBucket: "grkweb-app.appspot.com",
            messagingSenderId: "490958611799",
            appId: "1:490958611799:web:9b89f72ea42bf74aae4a12",
            measurementId: "G-Q4Y681H9GL"
        });
        firebaseAppInstance.analytics();
    }
    return firebaseAppInstance;
}

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/apps',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
};


export { firebaseApp, uiConfig };