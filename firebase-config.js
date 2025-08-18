// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArKOkY72tx9qOelx_oeMnUuS4XZe58df4",
  authDomain: "green-door-rpg.firebaseapp.com",
  projectId: "green-door-rpg",
  storageBucket: "green-door-rpg.appspot.com",
  messagingSenderId: "1062933456039",
  appId: "1:1062933456039:web:c292177334060d46a1e782"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
