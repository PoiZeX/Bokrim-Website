import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection
} from 'firebase/firestore'



initializeApp(firebaseConfig)

const db = getFirestore()


const colRef = collection(db, 'users')
console.log(firebase);


document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
});


