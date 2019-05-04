import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyBvYFJoGyqFzER5CJkZ4xmGqkuzpDuULhw',
  authDomain: 'lifetracker-10c6b.firebaseapp.com',
  databaseURL: 'https://lifetracker-10c6b.firebaseio.com',
  projectId: 'lifetracker-10c6b',
  storageBucket: 'lifetracker-10c6b.appspot.com',
  messagingSenderId: '313512207383'
})

var provider = new firebase.auth.GoogleAuthProvider()

// firebase
//   .auth()
//   // .signInWithEmailAndPassword('nikifordan@gmail.com', 'gogiHoola3')
//   .signInWithPopup(provider)
//   .then(function(result) {
//     console.log(result)
//   })
//   .catch(function(error) {
//     var errorCode = error.code
//     var errorMessage = error.message
//     console.log(errorMessage)
//   })

export const db = firebase.firestore()
