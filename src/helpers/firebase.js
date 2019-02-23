import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const firebaseConfig = {
    apiKey: "AIzaSyBot5tOfkhdUCvJsWh6sk--42syvvJwM4M",
    authDomain: "spot-pwa.firebaseio.com/",
    databaseURL: "https://spot-pwa.firebaseio.com",
    storageBucket: "spot-pwa.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;