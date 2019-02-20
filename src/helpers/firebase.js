import firebase from 'firebase';
// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/storage';

export const firebaseConfig = {
    apiKey: "AIzaSyBot5tOfkhdUCvJsWh6sk--42syvvJwM4M",
    authDomain: "spot-pwa.firebaseio.com/",
    databaseURL: "https://spot-pwa.firebaseio.com",
    storageBucket: "spot-pwa.appspot.com"
};

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const currentUser = auth.currentUser;
        console.log(currentUser)
    }
});


// console.log(currentUser)
export default firebase;