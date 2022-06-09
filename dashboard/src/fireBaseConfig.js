import firebase from "firebase";

const firebaseConfig = {

    apiKey: "AIzaSyDoCJxuvEZfTFq7Y5uclxeZMMi3wA2yB00",
  
    authDomain: "webplayer-3cf38.firebaseapp.com",
  
    projectId: "webplayer-3cf38",
  
    storageBucket: "webplayer-3cf38.appspot.com",
  
    messagingSenderId: "709356189424",
  
    appId: "1:709356189424:web:b88ab4da7f1dd56dea7435"
  
  };
  
  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  export default storage;