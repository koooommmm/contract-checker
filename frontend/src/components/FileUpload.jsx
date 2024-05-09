import axios from 'axios';
import { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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
                },
              }
            );
            setUploadResult(response.data);
          } catch (error) {
            console.error('Error uploading file:', error);
            setUploadResult({
              error: 'Error uploading file. Please try again.',
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
    <div>
      <form onSubmit={handleSubmit} className='mt-5'>
        <input
          type='file'
          onChange={handleFileChange}
          className='border-gray-300 px-4 py-2 rounded-md mb-3'
        />
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          アップロード
        </button>
      </form>

      {loading && <p>Loading, please wait...</p>}

      {!loading && uploadResult && (
        <div>
          {uploadResult.error ? (
            <p>{uploadResult.error}</p>
          ) : (
            <div>
              <p>File URL: {uploadResult.fileUrl}</p>
              <p>Risk Analysis:</p>
              <ul>
                {uploadResult.riskAnalysis.map((item, index) => (
                  <li key={index}>
                    <strong>{item.article}</strong>: {item.content}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
