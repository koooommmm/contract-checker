import React from 'react';
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

  // TODO: サインアウト時のちらつきを抑える
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <nav className='w-full h-auto p-5 bg-white '>
      <a href='/' className='flex justify-center'>
        <span className='text-3xl text-red-400 font-bold'>
          契約書チェッカー
        </span>
      </a>

      {/* TODO: ログアウトボタンのレイアウト修正 */}
      {user && (
        <button
          onClick={async () => {
            await signOut();
          }}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
        >
          ログアウト
        </button>
      )}
    </nav>
  );
};

export default Header;
