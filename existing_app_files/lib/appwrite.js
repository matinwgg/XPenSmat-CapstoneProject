import { 
    Account, 
    Client, 
    ID, 
    Avatars, 
    Databases, 
    Query, 
    OAuthProvider, 
} from 'react-native-appwrite';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

const extra = Constants.expoConfig?.extra ?? {};

const envValue = (name, fallback) => process.env[name] ?? fallback;
const requiredValue = (name, value) => {
    if (!value) {
        throw new Error(
            `Missing ${name}. Copy .env.example to .env and configure Appwrite.`
        );
    }
    return value;
};

export const config = {
    endpoint: requiredValue(
        'EXPO_PUBLIC_APPWRITE_ENDPOINT',
        envValue('EXPO_PUBLIC_APPWRITE_ENDPOINT', extra.appwriteEndpoint)
    ),
    platform: envValue(
        'EXPO_PUBLIC_APPWRITE_PLATFORM',
        extra.appwritePlatform ?? 'com.xpensmat.app'
    ),
    projectId: requiredValue(
        'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
        envValue('EXPO_PUBLIC_APPWRITE_PROJECT_ID', extra.appwriteProjectId)
    ),
    databaseId: requiredValue(
        'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
        envValue('EXPO_PUBLIC_APPWRITE_DATABASE_ID', extra.appwriteDatabaseId)
    ),
    userCollectionId: requiredValue(
        'EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID',
        envValue(
            'EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID',
            extra.appwriteUserCollectionId
        )
    ),
    expenseCollectionId: requiredValue(
        'EXPO_PUBLIC_APPWRITE_EXPENSE_COLLECTION_ID',
        envValue(
            'EXPO_PUBLIC_APPWRITE_EXPENSE_COLLECTION_ID',
            extra.appwriteExpenseCollectionId
        )
    ),
    storageId: envValue(
        'EXPO_PUBLIC_APPWRITE_STORAGE_ID',
        extra.appwriteStorageId
    ),
};

const oauthRedirect = envValue(
    'EXPO_PUBLIC_OAUTH_REDIRECT',
    Linking.createURL('auth/callback')
);
const verifyUrl = envValue(
    'EXPO_PUBLIC_VERIFY_URL',
    Linking.createURL('verify')
);
const recoveryUrl = envValue(
    'EXPO_PUBLIC_RECOVERY_URL',
    Linking.createURL('recovery')
);

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
         //console.log("hey:",newAccount.$id)
         if (!newAccount) {throw new Error};
         const avatarUrl = avatars.getInitials(username);
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
        console.log("Appwrite service :: signUpAccount() :: " + Error(error));
     }
 }

  // Verify new user
  export const verifyEmail = async () => {
    try{
       await account.createVerification(verifyUrl);
        Alert.alert( "Verification email sent!", "We've sent you a verification link to your email. Tap on it to get verified.")
    }
    catch(error){
        console.log("Error sending verification email: ", error); // Failure
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

 // Sign In
 export const signIn = async (email, password) => {
     try {
        // User exists, proceed to create session
        const session = await account.createEmailPasswordSession(email, password)
        return session
     } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: loginAccount() :: " + Error(appwriteError));
        return
     }
 }

 // Get Current user
 export const getCurrentUser = async () => {
     try {
         const currentAccount = await getAccount();

         const currentUser = await databases.listDocuments(
             config.databaseId,
             config.userCollectionId,
             [Query.equal('accountId', currentAccount.$id)]
         )

         if (!currentUser) throw Error;

         return currentUser.documents[0];
     } catch (error) {
        console.log("Appwrite service :: getCurrentUser() :: " + error);
     }
 }

 // Check if user seesion is active
export const checkSession = async () => {
    try {
        await account.getSession("current")
        return true;
    } catch (error) {
        return false;
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

 // Get all user posts for stats
 export const getPostsStats = async (creatorId) => {
    try {
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.orderDesc('date'),
                Query.limit(30),
            ]
        )
        return allExpenses.documents;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: getAllExpenses() :: " + Error(appwriteError.message));    
    }
 }

 // Get posts expense stats
 export const getExpStats = async (creatorId) => {
    try {
        const now = new Date();
        const startOfMonthTimestamp = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        ).toISOString();
        const endOfMonthTimestamp = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
        ).toISOString();
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.greaterThanEqual('date', startOfMonthTimestamp),
                Query.lessThanEqual('date', endOfMonthTimestamp),
            ]
        )
        return allExpenses.documents;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: getAllExpenses() :: " + Error(appwriteError.message));    
    }
 }

 
 // Get all user posts for stats
 export const getPostsSummary = async (creatorId, startDate, endDate, type) => {
    try {
        const allExpenses = await databases.listDocuments(
            databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.greaterThanEqual('date', startDate),
                Query.lessThanEqual('date', endDate),
                Query.equal('type', type),
            ]
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
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.orderDesc('$createdAt'),
                Query.limit(7),
            ]
        )
        return recentExpenses.documents;
    } catch (error) {
        const appwriteError = error
        console.log("Appwrite service :: Get Recent Posts() :: " + Error(appwriteError.message));
    }
 }

 // Create/Add Expense
 export const upLoadExpense = async (item, description, category, amount, type, date, paymentMode, creatorId) => {
    try {
     return await databases.createDocument(
        config.databaseId,
        config.expenseCollectionId,
        ID.unique(),
        {
          item: item,
          description: description,
          category: category,
          ItemAmount: amount,
          type: type,
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

// Get document Id
export const getDocumentId = async () => {
    try {
        // Fetch all documents in the collection
        const currentAccount = await getAccount();

        const response = await databases.listDocuments(
            databaseId, 
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        
        // Extract document ID
        return response.documents[0].$id
        
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}
// Changing/Adding to user details
export const alterDetails = {
    setFName: async (documentId, fName) => {
        //console.log(getDocumentIds());
        if (!documentId) throw new Error('Missing SetFname documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,
            { firstName: fName }
        )
    },
    setLName: async ( documentId, lName) => {
        if (!documentId) throw new Error('Missing setLan documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,  
            { lastName: lName }

        )
    },
    setPhone: async ( documentId, phone) => {
        if (!documentId) throw new Error('Missing setPhone documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,
            { phone: phone }
        )
    },
    setCity: async ( documentId, city) => {
        if (!documentId) throw new Error('Missing setCity documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,
            { city : city }
        )
    },
    setCountry: async ( documentId, country) => {
        if (!documentId) throw new Error('Missing setCountry documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,
            {  country: country}
        )
    },
    setCurrency: async ( documentId, currency) => {
        if (!documentId) throw new Error('Missing setCurrency documentId');
        return await databases.updateDocument(
            databaseId,
            userCollectionId,
            documentId,
            { currency: currency }
        )
    }
}


// Get posts that matches search query
export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.expenseCollectionId,
        [Query.search("category", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

 // Get data for statistics
 export const StatsData = async (creatorId) => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            expenseCollectionId,
            [Query.equal('creator', [creatorId])]
        );

        if (!posts) throw new Error("Something went wrong");
        return posts        
    } catch (error) {
        console.log("Stats data couldn't be fetched", error)
        return 
    }
 }

export const recoverPwd = {
    verifyEmail: async (email) => {
        return await account.getSession(email)
    },
    isUserVerified: async () => {
        try {
            const response = await account.get();            
            if (response.emailVerification) {
                //console.log("Email is verified");
                return true;
            } else {
                //console.log("Email is not verified");
                return false;
            }
            
        } catch (error) {
            return "Email is not verified" 
        }
        
    },
    SendEmail: async () => {
        try {
            await account.createVerification(verifyUrl)
            return true;
        } catch (error) {
            return false 
        }
        
    },
    recovery: async (email) => {
        try {
            await account.createRecovery(email, recoveryUrl);
            return true;
        } catch (error) {
            return false
        }
    },

    updatePassword: async (userId, secret, pwd, repwd) => {
        return await account.updateRecovery(userId, secret, pwd, repwd);
    }
}


  export const SignInWithGoogle = async () => {
    try {
        const result = account.createOAuth2Session(
            OAuthProvider.Google,
            oauthRedirect,
            oauthRedirect,
            ["profile", "email"]
        )
        console.log(result)
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const SignInWithGitHub = async () => {
    try {
        const result = account.createOAuth2Session(
            OAuthProvider.Github,
            oauthRedirect,
            oauthRedirect,
            ["repo", 'user']
        )
        console.log(result)
        return true;
    } catch (error) {
        console.log(error)
        return false;
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
