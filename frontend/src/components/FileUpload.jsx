import axios from 'axios';
import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('wordFile', file);
    const user = auth.currentUser;

    if (user) {
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
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleFileChange} />
        <button type='submit'>Upload and Convert</button>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Upload and Convert to PDF
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
