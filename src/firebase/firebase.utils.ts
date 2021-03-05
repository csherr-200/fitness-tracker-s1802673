import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA5N0wGhJ045rkVZ0iiYpB7z0Y90htYkv0",
    authDomain: "bug-tracker-ssd.firebaseapp.com",
    databaseURL: "https://bug-tracker-ssd.firebaseio.com",
    projectId: "bug-tracker-ssd",
    storageBucket: "bug-tracker-ssd.appspot.com",
    messagingSenderId: "965052790632",
    appId: "1:965052790632:web:581d18ed83e165b8e248dd",
    measurementId: "G-08MV79QHXZ"
};

firebase.initializeApp(firebaseConfig);

export const createUserProfileDocument = async (
    userAuth: firebase.User | null,
    additionalData: any
) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                myTickets: [""],
                ...additionalData,
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }
    }

    return userRef;
};

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userAuth) => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: "select_account"});

export default firebase;
