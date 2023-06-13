// Import the Firebase Admin SDK
import * as admin from "firebase-admin";
admin.initializeApp();

// Get a Firestore instance
const db = admin.firestore();

// A function to get a document by ID
const getDocument = async (collection: string, id: string): Promise<any> => {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data();
};

// Other database operation functions
// (addDocument, updateDocument, deleteDocument, etc.)

export {
  getDocument,
  // Other exported functions
};
