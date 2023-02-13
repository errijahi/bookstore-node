import { initializeApp } from "firebase/app";
import * as dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
  apiKey:  process.env.APIKEY,
  authDomain:  process.env.AUTHDOMAIN,
  projectId:  process.env.PROJECTID,
  storageBucket:  process.env.STORAGEBUCKET,
  messagingSenderId:  process.env.MESSAGINGSENDERID,
  appId:  process.env.APPID,
  measurementId:  process.env.MEASURMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebaseConfig;