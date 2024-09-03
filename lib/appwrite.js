import { 
    Account, 
    Client, 
    ID, 
    Avatars, 
    Databases, 
    Query, 
    OAuthProvider, 
    Users,
} from 'react-native-appwrite';
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
  export const verifyEmail = async (email) => {
    try{
       await account.createVerification(email);
        Alert.alert( "Verification email sent!", "We've sent you a verification link to your email. Tap on it to get verfied.")
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
            databaseId,
            config.expenseCollectionId,
            [Query.equal('creator', [creatorId])],
            {
                orderField: 'date',
                orderType: 'DESC',
                limit: 30,
            }
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
        const allExpenses = await databases.listDocuments(
            databaseId,
            config.expenseCollectionId,
            [Query.equal('creator', [creatorId]), ],
            [
                {
                  key: 'date',
                  range: {
                    start: startOfMonthTimestamp,
                    end: endOfMonthTimestamp,
                  },
                },
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
}


// Get posts that matches search query
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

export const recoverPwd = {
    verifyEmail: async (email) => {
        return await account.getSession(email)
    },
    isUserVerified: async () => {
        try {
            const response = await account.get();
            if (response.emailVerification) {
                console.log("Email is verified");
                return true;
            } else {
                console.log("Email is not verified");
                return false;
            }
            
        } catch (error) {
            return "Email is not verified" 
        }
        
    },
    SendEmail: async () => {
        try {
            await account.createVerification("http://node-server-production-4be3.up.railway.app/verify")
            return true;
        } catch (error) {
            return false 
        }
        
    },
    recovery: async (email) => {
        try {
            await account.createRecovery(email, 'http://node-server-production-4be3.up.railway.app/recovery');
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
            'http://node-server-production-4be3.up.railway.app/sign-in-with-google',
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
            'https://node-server-production-4be3.up.railway.app/sign-in-with-github',
            ["repo", 'user']
        )
        console.log(result)
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
