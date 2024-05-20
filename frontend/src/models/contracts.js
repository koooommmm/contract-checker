import axios from 'axios';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebaseConfig';

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

// Firebaseから契約書情報を取得するヘルパー関数
async function fetchContracts() {
  const user = auth.currentUser;

  if (user) {
    try {
      const idToken = await user.getIdToken();
      const response = await axios.get(`${BACKEND_ENDPOINT}/api/files/`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
          userid: user.uid,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error get contracts:`, error);
    }
  } else {
    alert('You must be logged in to perform this action.');
  }
}

// 契約書の概要の一覧を取得
export async function getContractsList() {
  return fetchContracts();
}

// 契約書の詳細を取得
export async function getContract(contractId) {
  const docRef = doc(collection(firestore, 'contracts'), contractId);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
}

// バックエンドと通信して契約書情報を更新または削除するヘルパー関数
async function updateOrDeleteContract(postData, action) {
  const user = auth.currentUser;

  if (user) {
    try {
      const idToken = await user.getIdToken();
      await axios.post(`${BACKEND_ENDPOINT}/api/files/${action}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (error) {
      console.error(`Error ${action} contract:`, error);
    }
  } else {
    alert('You must be logged in to perform this action.');
  }
}

// 契約書情報を更新
export async function updateContract(contractId, newTitle) {
  const postData = {
    contractId: contractId,
    newTitle: newTitle,
  };
  await updateOrDeleteContract(postData, 'update');
}

// 契約書を削除
export async function deleteContract(contractId, filePath) {
  const postData = {
    contractId: contractId,
    filePath: filePath,
  };
  await updateOrDeleteContract(postData, 'delete');
}
