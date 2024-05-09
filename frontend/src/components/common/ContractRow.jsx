import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateContract } from '../../models/contracts';

import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { HiPencil } from 'react-icons/hi2';
import { MdDelete } from 'react-icons/md';

async function editTitle(id, title) {
  await updateContract(id, { title: title });
}

const ContractRow = (props) => {
  const [title, setTitle] = useState(props.title);
  let isEditing = props.isEditing;
  const setEditingIndex = props.setEditingIndex;

  // navigate関数
  const navigate = useNavigate();

  return (
    <tr key={props.index}>
      <td className='p-2 w-2/3'>
        {/* ファイル名 */}
        {isEditing == false ? (
          /* 詳細へのリンク */
          <button
            onClick={() => {
              navigate('/contract/' + props.id);
            }}
            className='float-left'
          >
            {title}
          </button>
        ) : (
          /* 編集中 */
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border'
          />
        )}

        {/* 編集ボタン・決定ボタン・取り消しボタン */}
        {isEditing == false ? (
          /* 編集ボタン */
          <button
            onClick={() => setEditingIndex(props.index)}
            className='float-right'
          >
            <HiPencil size={20} color={'#888'} />
          </button>
        ) : (
          /* 決定ボタン・取り消しボタン */
          <>
            <button
              onClick={() => {
                setEditingIndex(-1);
                setTitle(props.title);
              }}
              className='float-right'
            >
              <FaTimes size={20} color={'#888'} />
            </button>
            <button
              onClick={async () => {
                await editTitle(props.id, title);
                setEditingIndex(-1);
              }}
              className='float-right'
            >
              <FaCheck size={20} color={'#d22'} />
            </button>
          </>
        )}
      </td>
      <td className='p-2'>
        {/* 作成日 */}
        <div className='float-left'>{props.createdAt}</div>
        {/* 削除ボタン
            TODO 削除機能の実装 */}
        <button className='float-right'>
          <MdDelete size={24} color={'#888'} />
        </button>
      </td>
    </tr>
  );
};

ContractRow.propTypes = {
  title: PropTypes.string,
  isEditing: PropTypes.bool,
  setEditingIndex: PropTypes.func,
  index: PropTypes.number,
  id: PropTypes.string,
  createdAt: PropTypes.string,
};

export default ContractRow;
