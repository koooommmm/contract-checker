const { admin, storage } = require('../config/firebaseConfig');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const db = admin.firestore();

exports.verifyIdToken = (idToken) => {
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      return { isValid: true, uid: decodedToken.uid };
    })
    .catch((error) => {
      console.error(error);
      return { isValid: false, error: error };
    });
};
exports.uploadToFirebaseStorage = async (pdfBuffer, userId) => {
  const fileRef = ref(storage, `user_uploads/${userId}/${Date.now()}.pdf`);
  await uploadBytes(fileRef, pdfBuffer);
  return getDownloadURL(fileRef);
};

exports.addDocument = async (collectionName, documentJson) => {
  const collectionRef = db.collection(collectionName);
  const docRef = collectionRef.doc();
  await docRef.set(documentJson);
  return docRef.id;
};
