import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/common/UploadForm';

const Upload = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex items-center justify-between p-5 max-w-4xl mx-auto'>
        <div className='text-lg font-bold'>請求書アップロード</div>
      </div>
      <UploadForm />
      <div className='flex justify-center'>
        <button
          className='px-5 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-black'
          onClick={() => navigate('/')}
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default Upload;
