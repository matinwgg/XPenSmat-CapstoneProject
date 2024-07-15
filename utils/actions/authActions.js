import { getFirebaseApp } from "../firebaseHelper";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

 import { child, getDatabase, set, ref } from "firebase/database"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authenticate } from "../../store/authSlice";

export const signUp = (username, email, password) => {
    return async (dispatch) => {
        const app = getFirebaseApp()
        const auth = getAuth(app)

        try {
            const result = await createUserWithEmailAndPassword(
                auth, 
                email,
                password,
            );

            const { uid, stsTokenManager } = result.user;
            const { accessToken, expirationTime} = stsTokenManager;
            const expiryDate = new Date(expirationTime)

            const userData = await createUser(username, email, uid);

            dispatch(authenticate({
                token: accessToken, userData
            }))

            saveToDataToStorage(accessToken, uid, expiryDate)

        } catch (error) {
            console.log(error)

            const errorCode = error.code;
            let message = "Something went wrong..."

            if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
                message = "Invalid email or password"
            }

            if (errorCode === "auth/email-already-in-use") {
                message = "Email already in use"
            }

            throw new Error(message)
        }
    }
};

export const signIn = (email, password) => {
    return async (dispatch) => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        try {
            const result = await signInWithEmailAndPassword(
                auth, email, password,
            );

            const { uid, stsTokenManager } = result.user;
            const { accessToken, expirationTime } = stsTokenManager;
            const expiryDate = new Date(expirationTime);

            const userData = await getUserData(uid)

            dispatch(authenticate({
                token: accessToken, userData
            }))

            saveToDataToStorage(accessToken, uid, expiryDate)



        } catch (error) {
            console.log(error)

            const errorCode = error.code;
            let message = "Something went wrong..."

            if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
                message = "Invalid email or password"
            }
            if (errorCode === "auth/invalid-credentials") {
                message = "Please check your email or password"
            }

            throw new Error(message)
        }
    }
}

const createUser = async (username, email, userId) => {
    const userData = {
        username,
        email,
        userId,
        signUpDate: new Date().toISOString(),
    }

    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`)
    await set(childRef, userData)
    return userData
};

const saveToDataToStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token,
            userId,
            expiryDate: expiryDate.toISOString(),
        })
    )
}