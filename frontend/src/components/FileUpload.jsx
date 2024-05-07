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
    const formData = new FormData();
    formData.append('wordFile', file);
    const user = auth.currentUser;

    if (user) {
      setLoading(true);
      setUploadResult(null);

      try {
        const response = await axios.post(
          `${BACKEND_ENDPOINT}/api/files/upload?userId=${user.uid}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setUploadResult(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadResult({ error: 'Error uploading file. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='file' accept='.docx,.pdf' onChange={handleFileChange} />
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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
