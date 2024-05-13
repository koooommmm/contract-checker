import { useNavigate } from 'react-router-dom';
import ContractsList from '../components/common/ContractsList';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex items-center justify-between p-5 max-w-4xl mx-auto'>
        <div className='text-lg font-bold'>請求書リスト</div>
        <button
          type='button'
          onClick={() => navigate('/upload')}
          className='bg-red-500 text-white p-3 rounded-full hover:bg-red-600 disabled:bg-red-300'
        >
          新規追加
        </button>
      </div>
      <div className=' max-w-4xl mx-auto'>
        <ContractsList />
      </div>
    </div>
  );
};

export default Home;
