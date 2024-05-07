const storage = require('../config/firebaseConfig');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.uploadToFirebase = async (pdfBuffer, userId) => {
  const fileRef = ref(storage, `user_uploads/${userId}/${Date.now()}.pdf`);
  await uploadBytes(fileRef, pdfBuffer);
  return getDownloadURL(fileRef);
};
