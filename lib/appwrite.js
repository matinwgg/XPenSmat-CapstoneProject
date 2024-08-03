import { Account, Client, ID, Avatars, Databases, Query, OAuthProvider } from 'react-native-appwrite';
import { Alert } from 'react-native';

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
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform) // Your application ID or bundle ID.
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
        if (error.code === 'user-not-found') {
            Alert.alert("Error", "User not found. Please check your credentials.")
          } else {
            console.log("Appwrite service :: loginAccount() :: " + Error(appwriteError));
        }
     }
 }


// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: getAccount() :: " + Error(appwriteError.message));    
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
        const appwriteError = error
            console.log("Appwrite service :: getCurrentUser() :: " + Error(appwriteError));
     }
 }

// Sign Out
export async function signOut() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: getCurrentAccount() :: " + Error(appwriteError.message));    
    }
  }

// Get all user posts
 export const getAllPosts = async (creatorId) => {
    try {
        const allExpenses = await databases.listDocuments(
            databaseId,
            config.expenseCollectionId,
            [Query.equal('creator', [creatorId])]
        )
        return allExpenses.documents;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: getAllExpenses() :: " + Error(appwriteError.message));    
    }
 }

 // Get all recent user posts
 export const getRecentPosts = async (creatorId) => {
    try {
        const recentExpenses = await databases.listDocuments(
            databaseId,
            config.expenseCollectionId,
            [Query.equal('creator', [creatorId]), Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return recentExpenses.documents;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: Get Recent Posts() :: " + Error(appwriteError.message));
    }
 }

 // Create/Add Expense
 export const upLoadExpense = async (item, category, amount, date, paymentMode, creatorId) => {
    try {
     return await databases.createDocument(
        config.databaseId,
        config.expenseCollectionId,
        ID.unique(),
        {
          item: item,
          category: category,
          ItemAmount: amount,
          dateofpurchase: date,
          modeOfPayment: paymentMode,
          creator: creatorId,
        }
      );
  
    } catch (error) {
        console.log("Appwrite service :: AddToExpense() :: " + Error(error));    }
  }

   // Delete document
 export const deleteExpense = async (id) => {
    try {
       return await databases.deleteDocument(
        databaseId,
        expenseCollectionId,
        id,
       )
    } catch (error) {
       const appwriteError = error
       console.log("Appwrite service :: deleteExpense() :: " + Error(appwriteError.message));
    }
}


// Get video posts that matches search query
export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.expenseCollectionId,
        [Query.search("category", [query])]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

// OTP Email
export const SessionTokenEmail = async (email) => {
  try {
    return await account.createEmailToken(
    ID.unique(),
    email,
).userCollectionId;

  } catch (error) {
    throw new Error(error)
  }
}

export const CreateSessionEmail = async (secret) => {
    try {
        return await account.CreateSession(
            SessionTokenEmail(),
            secret
        )
    } catch (error) {
        throw new Error(error)
    }
}

// OTP Phone Number
export const SessionTokenSMS = async (phone) => {
    try {
      return await account.createPhoneToken(
      ID.unique(),
      phone
  ).userCollectionId;
  
    } catch (error) {
      throw new Error(error)
    }
  }

  export const CreateSessionSMS = async (secret) => {
    try {
        return await account.CreateSession(
            SessionTokenSMS(),
            secret
        )
    } catch (error) {
        throw new Error(error)
    }
}

  // complete verification for the client
export const updateVerification = async (userId, secret) => {
    try{
       const response = await account.updateVerification(userId, secret);
         console.log(response); // Success
            return response;
    }
    catch(error){
        console.log(error); // Failure
        throw error;
    }
}

// update and reset the password
export const updateNewPassword = async (userId, secret, password,password_confirm) => {
    try {
        const response = await account.updateRecovery(userId, secret, password,password_confirm);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};
  


  export const SignInWithGoogle = async () => {
    try {
        return account.createOAuth2Session(
            OAuthProvider.Google,
            'https://localhost:8081/',
            'https://localhost:8081/'
        )
    } catch (error) {
        throw new Error(error)
    }
}

export const SignInWithGitHub = async () => {
    try {
        return account.createOAuth2Session(
            OAuthProvider.Github,
            'http://localhost:8081/',
            'http://localhost:8081/fail'
        )
    } catch (error) {
        throw new Error(error)
    }
}

export const SignInWithFacebook = async () => {
    try {
        return account.createOAuth2Session(
            OAuthProvider.Facebook,
            'http://localhost:8081/',
            'http://localhost:8081/fail'
        )
    } catch (error) {
        throw new Error(error)
    }
}

// const handleOAuth2Login = (provider: OAuthProvider) => {
//     try {
//       const data = account.createOAuth2Session(provider)
//       return Linking.openURL(`${data}`)
//     } catch (error) {
//       console.log(error)
//     }
//   }

