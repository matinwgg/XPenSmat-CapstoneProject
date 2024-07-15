import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';
//import SignIn from '../app/(auth)/sign-in';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform:'com.wgg.aora',
    projectId: '6683dcb7003b64e8be7c',
    databaseId: '6683deb50023c056b0da',
    userCollectionId: '6683dfc40024b422379f',
    expenseCollectionId: '6683e02e001c9e71821a',
    storageId: '66847bad001853c5e8b6',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    expenseCollectionId,
    storageId,
} = config

 //Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;


 const account = new Account(client);
 const avatars = new Avatars(client);
 const databases = new Databases(client);

 // Register user
 export const createUser = async (email, password, username) => {
     try {
         const newAccount = await account.create(
             ID.unique(),
             email,
             password, 
             username,

         );

         if (!newAccount) throw Error;

         const avatarUrl = avatars.getInitials(username);

         await signIn(email, password);

         const newUser = await databases.createDocument(
             config.databaseId,
             config.userCollectionId,
             ID.unique(),
             {
                 accountId: newAccount.$id,
                 email,
                 username,
                 avatar: avatarUrl
             }
         )
         return newUser;
     } catch(error) {
         console.log("Appwrite service :: loginAccount() :: " + Error(error));
     }
 }

 // Sign In
 export const signIn = async (email, password) => {
     try {
        return await account.createEmailPasswordSession(email, password)
     } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: loginAccount() :: " + Error(appwriteError.message));
     }
 }


// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

 // Get Current user
 export const getCurrentUser = async () => {
     try {
         const currentAccount = await account.get();

         if (!currentAccount) throw Error;

         const currentUser = await databases.listDocuments(
             config.databaseId,
             config.userCollectionId,
             [Query.equal('accountId', currentAccount.$id)]
         )

         if (!currentUser) throw Error;

         return currentUser.documents[0];
     } catch (error) {
        console.log(error)
     }
 }


// Sign Out
export async function signOut() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
        console.log("Appwrite service :: getCurrentAccount() :: " + error);    }
  }

  // Create/Add Expense


 export const getAllPosts = async () => {
    try {
        const allExpenses = await databases.listDocuments(
            databaseId,
            expenseCollectionId
        )
        return allExpenses.documents;
    } catch (error) {
        throw new Error(error)
    }
 }

 
 export const getRecentPosts = async () => {
    try {
        const allExpenses = await databases.listDocuments(
            databaseId,
            expenseCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return allExpenses.documents;
    } catch (error) {
        throw new Error(error)
    }
 }