// import firebase from 'firebase/app';
import { collection, query, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

// 契約書データのスキーマ
// {
//     contractId: int,
//     title: text,
//     pdf: text,
//     createdAt: Timestamp,
//     alarts: [
//         {
//             article: text,
//             content: text
//         },
//         ...
//     ]
// }

// 契約書を追加
// TODO 今のFirebaseのversionに合致しない書き方なので書き換える

// export async function addContract(contractId, title, pdf, alerts) {
//     const contracts = collection(firestore, 'contracts');
//     const q = query(contracts);
//     db.collection('contracts').doc(contractId).set({
//         title: title,
//         pdf: pdf,
//         alerts, alerts,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp() // サーバーのタイムスタンプを使用
//     });
// }

// 契約書の概要の一覧を取得
export async function getContractsList() {
    const contracts = collection(firestore, 'contracts');
    const q = query(contracts);
    const querySnapshot = await getDocs(q);

    let list = []

    querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt.toDate().toLocaleDateString(
            'ja-JP', {year: 'numeric',month: '2-digit',day: '2-digit'}
        );
        list.push({
            id: doc.id,
            title: data.title,
            createdAt: date
        })
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
export async function updateContract(contractId, data) {
    const colRef = collection(firestore, 'contracts');
    const docRef = doc(colRef, contractId);
    await updateDoc(docRef, data);
}

// 契約書を削除
export async function deleteContract(contractId) {
    const colRef = collection(firestore, 'contracts');
    const docRef = doc(colRef, contractId);
    await deleteDoc(docRef);
}