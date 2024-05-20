import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

const Header = () => {
  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <nav className='grid grid-cols-3 items-center justify-center h-20'>
      <div className='col-span-1'></div>
      <div className='col-span-1 flex justify-center items-center'>
        <a href='/' className='text-center'>
          <span className='text-3xl text-red-400 font-bold'>
            契約書チェッカー
          </span>
        </a>
      </div>
      {user ? (
        <div className='col-span-1 flex justify-end items-center pr-10'>
          <button
            onClick={async () => {
              await signOut();
            }}
            className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className='col-span-1'></div>
      )}
    </nav>
  );
};

export default Header;
