const firebase = require("firebase");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyArkeTpWLAbgz6F8t1M9aFRzraMpf8AUfU",
    authDomain: "choice-8caa5.firebaseapp.com",
    projectId: "choice-8caa5",
    storageBucket: "choice-8caa5.appspot.com",
    messagingSenderId: "571472487077",
    appId: "1:571472487077:web:86d777b80615bdedbaa34c",
    measurementId: "G-SYZ6HPB44L"
};


let firebase_ = firebase.initializeApp(firebaseConfig);
let db = firebase_.firestore();

module.exports.db = db;
