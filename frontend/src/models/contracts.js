// import firebase from 'firebase/app';
import axios from 'axios';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebaseConfig';

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

// 契約書の概要の一覧を取得
export async function getContractsList() {
  const contracts = collection(firestore, 'contracts');
  const q = query(contracts);
  const querySnapshot = await getDocs(q);

  let list = [];

  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const createdAt = new Date(data.createdAt);
    const date = createdAt.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    list.push({
      id: doc.id,
      title: data.title,
      createdAt: date,
      filePath: data.filePath,
    });
  });

  return list;
}

// 契約書の詳細を取得
export async function getContract(contractId) {
  const colRef = collection(firestore, 'contracts');
  const docRef = doc(colRef, contractId);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
}

// 契約書情報を更新
export async function updateContract(contractId, newTitle) {
  const postData = {
    contractId: contractId,
    newTitle: newTitle,
  };
  const user = auth.currentUser;

  if (user) {
    // 認証トークンを取得
    user
      .getIdToken()
      .then(async (idToken) => {
        try {
          const response = await axios.post(
            `${BACKEND_ENDPOINT}/api/files/update`,
            postData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${idToken}`, // トークンをヘッダーに設定
              },
            }
          );
        } catch (error) {
          console.error('Error update title:', error);
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  } else {
    alert('You must be logged in to update files.');
  }
}

// 契約書を削除
export async function deleteContract(contractId, filePath) {
  const postData = {
    contractId: contractId,
    filePath: filePath,
  };
  const user = auth.currentUser;

  if (user) {
    // 認証トークンを取得
    user
      .getIdToken()
      .then(async (idToken) => {
        try {
          const response = await axios.post(
            `${BACKEND_ENDPOINT}/api/files/delete`,
            postData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${idToken}`, // トークンをヘッダーに設定
              },
            }
          );
        } catch (error) {
          console.error('Error update title:', error);
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  } else {
    alert('You must be logged in to update files.');
  }
}
