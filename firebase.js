import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC8rXsSIttXJEl5JcpbXZi8q1qRt_f6xcQ",
  authDomain: "loud-nft.firebaseapp.com",
  projectId: "loud-nft",
  storageBucket: "loud-nft.appspot.com",
  messagingSenderId: "144491385158",
  appId: "1:144491385158:web:9f3e9a39ecf64666385547",
  measurementId: "G-TWB24JLCNL",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
