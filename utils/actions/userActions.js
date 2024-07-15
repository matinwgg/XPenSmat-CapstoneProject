import { child, get, getDatabase, ref } from "firebase/database"
import { getFirebaseApp } from "../firebaseHelper"

// Retrieve user info based on user id
export const getUserData = async (userId) => {
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app))

        const userRef = child(dbRef, `user/${userId}`)

        const snapshot = await get(userRef)

        return snapshot.val()
    } catch (error) {
        
    }
}