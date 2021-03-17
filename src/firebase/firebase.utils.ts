import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDPHWa5tIq5AHq2bKuTQC8PoMxRNLQxwGI",
    authDomain: "ssd-cw2-bugtracker.firebaseapp.com",
    databaseURL: "https://ssd-cw2-bugtracker.firebaseio.com",
    projectId: "ssd-cw2-bugtracker",
    storageBucket: "ssd-cw2-bugtracker.appspot.com",
    messagingSenderId: "619846878427",
    appId: "1:619846878427:web:ddda36ab9f2563ea96f8fe",
    measurementId: "G-GY50B4ZNPR"
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
