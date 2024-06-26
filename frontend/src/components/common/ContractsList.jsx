import { useEffect, useState } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

import { getContractsList } from '../../models/contracts';
import ContractRow from './ContractRow';

const ContractsList = () => {
  const [user, loading, error] = useAuthState(auth);
  const [contractsList, setContractsList] = useState([]);
  const fetchContracts = async () => {
    const contracts = await getContractsList();
    setContractsList(contracts);
  };
  // 非同期関数でデータを取得し、`contractsList`にセット
  useEffect(() => {
    fetchContracts();
  }, []);

  // ファイル名を編集する際ひとつずつしか編集できないようにするためのstate
  // -1     : 未選択
  // 0 ~ N-1: 編集中の行のインデックス

  const [editingIndex, setEditingIndex] = useState(-1);

  if (loading) {
    return <div>ローディング</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    user && (
      <table className='text-left md:container md:mx-auto rounded-md border-separate border border-slate-300'>
        <thead className='bg-red-100'>
          <tr>
            <th className='p-2'>タイトル</th>
            <th className='p-2'>作成日</th>
          </tr>
        </thead>
        <tbody>
          {contractsList.map((item, index) => {
            const createdAt = new Date(item.createdAt);
            return (
              <ContractRow
                key={item.id}
                index={index}
                id={item.id}
                title={item.title}
                createdAt={createdAt.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                filePath={item.filePath}
                isEditing={editingIndex === index}
                setEditingIndex={setEditingIndex}
                fetchContracts={fetchContracts}
              />
            );
          })}
        </tbody>
      </table>
    )
  );
};

export default ContractsList;
