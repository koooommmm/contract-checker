import axios from 'axios';
import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState();
  const closeModal = () => setLoading(false);

  const navigate = useNavigate();

  // ファイル選択時の処理
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // フォーム送信時の処理
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const user = auth.currentUser;

    if (user) {
      setLoading(true);
      setUploadResult(null);

      // 認証トークンを取得
      user
        .getIdToken()
        .then(async (idToken) => {
          try {
            const response = await axios.post(
              `${BACKEND_ENDPOINT}/api/files/upload`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${idToken}`, // トークンをヘッダーに設定
                  userId: user.uid,
                },
              }
            );
            setLoading(false);
            navigate(`/contract/${response.data.id}`);
          } catch (error) {
            setUploadResult({
              error: error.response.data.error,
            });
          } finally {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error getting token:', error);
          setLoading(false);
          setUploadResult({
            error: 'Authentication error. Please log in again.',
          });
        });
    } else {
      alert('You must be logged in to upload files.');
    }
  };

  return (
    <div className='p-5 max-w-4xl mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center'
      >
        <div className='mb-4 w-full'>
          <input
            type='file'
            onChange={handleFileChange}
            className='block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-red-50 file:text-red-700
            hover:file:bg-red-100'
          />
        </div>
        {uploadResult != null && (
          <p className='p-3 my-10 text-center text-red-500 rounded bg-red-100'>
            {uploadResult.error}
          </p>
        )}
        <button
          type='submit'
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          アップロード
        </button>
        {loading && (
          <Modal
            isOpen={loading}
            onRequestClose={closeModal}
            contentLabel='確認'
            className='p-8 bg-white rounded-lg max-w-xl mx-auto my-24 text-center'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
          >
            <div className='text-center'>
              <p className='m-5'>解析中です</p>
              <div className='flex justify-center' aria-label='読み込み中'>
                <div className='animate-ping h-2 w-2 bg-blue-600 rounded-full'></div>
                <div className='animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4'></div>
                <div className='animate-ping h-2 w-2 bg-blue-600 rounded-full'></div>
              </div>
            </div>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
