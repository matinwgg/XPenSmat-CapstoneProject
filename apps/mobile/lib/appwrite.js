import { 
    Account, 
    Client, 
    ID, 
    Avatars, 
    Databases, 
    Query, 
    OAuthProvider, 
    Permission,
    Role,
} from 'react-native-appwrite';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';

export const config = {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
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

const AUTH_REDIRECTS = {
    verification: Linking.createURL('verify'),
    recovery: Linking.createURL('recovery'),
    googleSuccess: Linking.createURL('sign-in-with-google'),
    githubSuccess: Linking.createURL('sign-in-with-github'),
    oauthFailure: Linking.createURL('oauth-failure'),
};

const isValidEmail = (email) => typeof email === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const throwAuthError = (error, fallbackMessage) => {
    const message = error?.response?.message || error?.message || fallbackMessage;
    const authError = new Error(message);
    authError.code = error?.code;
    authError.type = error?.type;
    throw authError;
};

 // Register user
 export const createUser = async (email, password, username) => {
     const normalizedEmail = email?.trim().toLowerCase();
     const normalizedUsername = username?.trim();

     if (!isValidEmail(normalizedEmail)) {
         throw new Error('Please enter a valid email address.');
     }
     if (typeof password !== 'string' || password.length < 8) {
         throw new Error('Password must be at least 8 characters.');
     }
     if (!normalizedUsername) {
         throw new Error('Please enter a username.');
     }

     try {
         const newAccount = await account.create(
             ID.unique(),
             normalizedEmail,
             password,
             normalizedUsername,
         );
         await account.createEmailPasswordSession(normalizedEmail, password);
         const avatarUrl = avatars.getInitials(normalizedUsername);

         return await databases.createDocument(
             config.databaseId,
             config.userCollectionId,
             ID.unique(),
             {
                 accountId: newAccount.$id,
                 email: normalizedEmail,
                 username: normalizedUsername,
                 avatar: avatarUrl,
             },
             [
                 Permission.read(Role.user(newAccount.$id)),
                 Permission.update(Role.user(newAccount.$id)),
                 Permission.delete(Role.user(newAccount.$id)),
             ]
         );
     } catch (error) {
         console.log('Appwrite service :: createUser() ::', error);
         throwAuthError(error, 'Unable to create your account.');
     }
 }

  const DEFAULT_VERIFICATION_URL = AUTH_REDIRECTS.verification;

  // Send Appwrite's native verification email to the current account.
  export const verifyEmail = async (emailOrUrl = DEFAULT_VERIFICATION_URL) => {
    try {
       const url = typeof emailOrUrl === 'string' && /^https?:\/\//.test(emailOrUrl)
         ? emailOrUrl
         : DEFAULT_VERIFICATION_URL;
       await account.createVerification(url);
       Alert.alert('Verification email sent!', 'Tap the link in your email to verify your account.');
       return true;
    } catch (error) {
       console.log('Error sending verification email: ', error);
       return false;
    }
}


// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
        console.log("Appwrite service :: getAccount() ::", error);
        return null;
    }
  }

 // Sign In
 export const signIn = async (email, password) => {
     const normalizedEmail = email?.trim().toLowerCase();
     if (!isValidEmail(normalizedEmail)) {
         throw new Error('Please enter a valid email address.');
     }
     if (typeof password !== 'string' || password.length === 0) {
         throw new Error('Please enter your password.');
     }

     try {
         return await account.createEmailPasswordSession(normalizedEmail, password);
     } catch (error) {
         console.log('Appwrite service :: signIn() ::', error);
         throwAuthError(error, 'Unable to sign in. Check your credentials.');
     }
 }

 // Get Current user
 export const getCurrentUser = async () => {
     try {
         const currentAccount = await getAccount();

         // No session yet: the app is being used by a guest.
         if (!currentAccount) return null;

         const currentUser = await databases.listDocuments(
             config.databaseId,
             config.userCollectionId,
             [Query.equal('accountId', currentAccount.$id)]
         )

         if (!currentUser || !currentUser.documents || currentUser.documents.length === 0) {
             return null;
         }

         return currentUser.documents[0];
     } catch (error) {
        console.log("Appwrite service :: getCurrentUser() ::", error);
        return null;
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
        console.log("Appwrite service :: getCurrentAccount() ::", error);
        return null;
    }
  }

// Get all user posts
 export const getAllPosts = async (creatorId) => {
    if (!creatorId) return [];
    try {
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [Query.equal('creator', [creatorId])]
        )
        return allExpenses.documents;
    } catch (error) {
        console.log("Appwrite service :: getAllExpenses() ::", error);
        return [];
    }
 }

 // Get all user posts for stats
 export const getPostsStats = async (creatorId) => {
    if (!creatorId) return [];
    try {
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.orderDesc('dateofpurchase'),
                Query.limit(30),
            ]
        )
        return allExpenses.documents;
    } catch (error) {
        console.log("Appwrite service :: getAllExpenses() ::", error);
        return [];
    }
 }

 // Return the ISO timestamps bounding the month containing `reference`.
 export const getMonthRange = (reference = new Date()) => {
    const start = new Date(reference.getFullYear(), reference.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
 };

 // Get posts expense stats for the current month
 export const getExpStats = async (creatorId, reference = new Date()) => {
    if (!creatorId) return [];
    try {
        const { start, end } = getMonthRange(reference);
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.greaterThanEqual('dateofpurchase', start.toISOString()),
                Query.lessThanEqual('dateofpurchase', end.toISOString()),
            ]
        )
        return allExpenses.documents;
    } catch (error) {
        console.log("Appwrite service :: getAllExpenses() ::", error);
        return [];
    }
 }

 
 // Get all user posts for stats
 export const getPostsSummary = async (creatorId, startDate, endDate, type) => {
    if (!creatorId) return [];
    try {
        const allExpenses = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
            [
                Query.equal('creator', [creatorId]),
                Query.greaterThanEqual('dateofpurchase', startDate),
                Query.lessThanEqual('dateofpurchase', endDate),
                Query.equal('type', type),
            ]
        )
        return allExpenses.documents;
    } catch (error) {
        console.log("Appwrite service :: getAllExpenses() ::", error);
        return [];
    }
 }


 // Get all recent user posts
 export const getRecentPosts = async (creatorId) => {
    if (!creatorId) return [];
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
        console.log("Appwrite service :: Get Recent Posts() ::", error);
        return [];
    }
 }

 // Create/Add Expense
 export const upLoadExpense = async (item, description, category, amount, type, date, paymentMode, creatorId) => {
    try {
     const currentAccount = await getAccount();
     if (!currentAccount) return null;
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
        },
        [
          Permission.read(Role.user(currentAccount.$id)),
          Permission.update(Role.user(currentAccount.$id)),
          Permission.delete(Role.user(currentAccount.$id)),
        ]
      );
  
    } catch (error) {
        console.log("Appwrite service :: AddToExpense() ::", error);
        return null;
    }
  }

   // Delete document
 export const deleteExpense = async (id) => {
    try {
       return await databases.deleteDocument(
        config.databaseId,
        config.expenseCollectionId,
        id,
       )
    } catch (error) {
       console.log("Appwrite service :: deleteExpense() ::", error);
       return null;
    }
}

// Get document Id
export const getDocumentId = async () => {
    try {
        // Fetch all documents in the collection
        const currentAccount = await getAccount();

        if (!currentAccount) return null;

        const response = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        
        // Extract document ID
        if (!response || !response.documents || response.documents.length === 0) {
            return null;
        }
        return response.documents[0].$id
        
    } catch (error) {
        console.error('Error fetching documents:', error);
        return null;
    }
}
// Changing/Adding to user details
export const alterDetails = {
    setFName: async (documentId, fName) => {
        //console.log(getDocumentIds());
        if (!documentId) throw new Error('Missing SetFname documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            { firstName: fName }
        )
    },
    setLName: async ( documentId, lName) => {
        if (!documentId) throw new Error('Missing setLan documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,  
            { lastName: lName }

        )
    },
    setPhone: async ( documentId, phone) => {
        if (!documentId) throw new Error('Missing setPhone documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            { phone: phone }
        )
    },
    setCity: async ( documentId, city) => {
        if (!documentId) throw new Error('Missing setCity documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            { city : city }
        )
    },
    setCountry: async ( documentId, country) => {
        if (!documentId) throw new Error('Missing setCountry documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            {  country: country}
        )
    },
    setCurrency: async ( documentId, currency) => {
        if (!documentId) throw new Error('Missing setCurrency documentId');
        return await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            { currency: currency }
        )
    }
}


// Get posts that matches search query
export async function searchPosts(query) {
    if (!query) return [];
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.expenseCollectionId,
        [Query.search("category", query)]
      );

      if (!posts) throw new Error("Something went wrong");

      return posts.documents;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

 // Get data for statistics
 export const StatsData = async (creatorId) => {
    if (!creatorId) return null;
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.expenseCollectionId,
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
            if (!response) return false;
            if (response.emailVerification) {
                //console.log("Email is verified");
                return true;
            } else {
                //console.log("Email is not verified");
                return false;
            }
            
        } catch (error) {
            return false;
        }
        
    },
    SendEmail: async () => {
        try {
            await account.createVerification(AUTH_REDIRECTS.verification);
            return true;
        } catch (error) {
            return false;
        }
    },
    recovery: async (email) => {
        const normalizedEmail = email?.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) return false;
        try {
            await account.createRecovery(normalizedEmail, AUTH_REDIRECTS.recovery);
            return true;
        } catch (error) {
            console.log('Appwrite service :: recovery() ::', error);
            return false;
        }
    },

    updatePassword: async (userId, secret, password, confirmation) => {
        if (!userId || !secret) throw new Error('Invalid or expired password recovery link.');
        if (typeof password !== 'string' || password.length < 8) {
            throw new Error('Password must be at least 8 characters.');
        }
        if (password !== confirmation) throw new Error('Passwords do not match.');
        return account.updateRecovery(userId, secret, password, confirmation);
    }
}


  export const SignInWithGoogle = async () => {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Google,
            AUTH_REDIRECTS.googleSuccess,
            AUTH_REDIRECTS.oauthFailure,
            ['profile', 'email']
        );
        return true;
    } catch (error) {
        console.log('Appwrite OAuth :: Google ::', error);
        return false;
    }
}

export const SignInWithGitHub = async () => {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Github,
            AUTH_REDIRECTS.githubSuccess,
            AUTH_REDIRECTS.oauthFailure,
            ['repo', 'user']
        );
        return true;
    } catch (error) {
        console.log('Appwrite OAuth :: GitHub ::', error);
        return false;
    }
}
