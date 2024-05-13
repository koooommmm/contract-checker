const { admin, storage } = require('../config/firebaseConfig');
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require('firebase/storage');

const db = admin.firestore();

exports.verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return { isValid: true, userId: decodedToken.uid };
  } catch (error) {
    console.error(error);
    return { isValid: false, userId: null, error: error };
  }
};

exports.uploadToFirebaseStorage = async (pdfBuffer, filePath) => {
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, pdfBuffer);
  return getDownloadURL(fileRef);
};

exports.deleteFileFromStorage = async (filePath) => {
  console.log(filePath);
  const fileRef = ref(storage, filePath);
  try {
    await deleteObject(fileRef);
    return { success: true, message: 'File deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete file:', error);
    return { success: false, message: 'Failed to delete file.', error: error };
  }
};

exports.addDocument = async (collectionName, documentJson) => {
  const collectionRef = db.collection(collectionName);
  const docRef = collectionRef.doc();
  await docRef.set(documentJson);
  return docRef.id;
};

exports.updateDocumentTitle = async (collectionName, documentId, newTitle) => {
  const docRef = db.collection(collectionName).doc(documentId);
  await docRef.update({
    title: newTitle,
  });
  return { success: true, message: 'Document title updated successfully.' };
};

exports.deleteDocument = async (collectionName, documentId) => {
  const docRef = db.collection(collectionName).doc(documentId);
  await docRef.delete();
  return { success: true, message: 'Document deleted successfully.' };
};
