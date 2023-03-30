import firebase from 'firebase/app'
import 'firebase/auth' // 用户验证用，无需分配名字
import 'firebase/firestore' // 与数据库交互，在数据库中存储除邮箱、密码以外的信息

const firebaseConfig = {
  apiKey: 'AIzaSyD34N8yoMKriJHF8zLhIL67q62SYcKdQiQ',
  authDomain: 'music-ad8bb.firebaseapp.com',
  projectId: 'music-ad8bb',
  storageBucket: 'music-ad8bb.appspot.com',
  // messagingSenderId: "246971294867",
  appId: '1:246971294867:web:00f7c8c458f45083415966'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()

const usersCollection = db.collection('users')
export {
  auth,
  db,
  usersCollection,
}