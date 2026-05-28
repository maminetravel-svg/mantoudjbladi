import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCfUVFt27o9sta923cuSMRvfT2y0-jKi5I',
  authDomain: 'mantoudj-fellah-bladi.firebaseapp.com',
  projectId: 'mantoudj-fellah-bladi',
  storageBucket: 'mantoudj-fellah-bladi.firebasestorage.app',
  messagingSenderId: '242283208162',
  appId: '1:242283208162:web:7958901193786fdd9fadbb',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
