import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    authDomain: "monday-club-48189.firebaseapp.com",
    projectId: "monday-club-48189",
    storageBucket: "monday-club-48189.appspot.com",
    appId: "1:59628633346:web:2a0c2fa4d80ca1ed87961b",
    measurementId: "G-DM31RQF8RH"
  };
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);

export default function ApiServices() {


    return {
        async writeUserData (score: number, isWinner: boolean, name: string){
            try {
              const docRef = await addDoc(collection(db, "score-2048"), {
                score: score,
                isWinner: isWinner,
                name: name,
                timeStamp: new Date().toISOString()
              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }
        }
    }