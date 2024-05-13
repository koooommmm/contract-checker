import PropTypes from 'prop-types';
import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import { deleteContract, updateContract } from '../../models/contracts';

import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { HiPencil } from 'react-icons/hi2';
import { MdDelete } from 'react-icons/md';

Modal.setAppElement('#root');

async function editTitle(contractId, newTitle) {
  await updateContract(contractId, newTitle);
}

async function deleteItem(contractId, filePath) {
  await deleteContract(contractId, filePath);
}

const ContractRow = (props) => {
  const [title, setTitle] = useState(props.title);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let isEditing = props.isEditing;
  const setEditingIndex = props.setEditingIndex;

  const navigate = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <tr key={props.index} className='bg-white'>
        <td className='p-2 w-2/3'>
          {isEditing == false ? (
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
              className='border w-2/3'
            />
          )}

          {isEditing == false ? (
            /* 編集ボタン */
            <button
              onClick={() => setEditingIndex(props.index)}
              className='float-right'
            >
              <HiPencil size={20} color={'#888'} />
            </button>
          ) : (
            <>
              {/* 取り消しボタン */}
              <button
                onClick={() => {
                  setEditingIndex(-1);
                  setTitle(props.title);
                }}
                className='float-right'
              >
                <FaTimes size={20} color={'#888'} />
              </button>
              {/* 決定ボタン */}
              <button
                onClick={async () => {
                  await editTitle(props.id, title);
                  await props.fetchContracts();
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
          <div className='float-left'>{props.createdAt}</div>
          <button className='float-right' onClick={openModal}>
            <MdDelete size={24} color={'#888'} />
          </button>
        </td>
      </tr>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='確認'
        className='p-8 bg-white rounded-lg max-w-xl mx-auto my-24 text-center'
        overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
      >
        <h2 className='text-lg font-bold mb-6'>
          「{props.title}」を削除しますか？
        </h2>
        <p className='mb-6'>この操作は取り消せません</p>
        <div className='flex justify-between gap-4'>
          <button
            onClick={closeModal}
            className='px-5 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-black'
          >
            キャンセル
          </button>
          <button
            onClick={async () => {
              await deleteItem(props.id, props.filePath);
              await props.fetchContracts();
              closeModal();
            }}
            className='px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white'
          >
            削除
          </button>
        </div>
      </Modal>
    </>
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
