import React from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

const Header = () => {
  const [signOut, loading, error] = useSignOut(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
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
      <button
        onClick={async () => {
          const success = await signOut();
          if (success) {
            alert('You are sign out');
          }
        }}
      >
        Sign out
      </button>
    </nav>
  );
};

export default Header;
