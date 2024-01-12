import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage, getStream } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://instagram-clone-ba35d-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "gs://instagram-clone-ba35d.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);
