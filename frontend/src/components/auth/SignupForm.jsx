import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { getErrorMessage } from '../../firebase/firebaseError';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(email, password);
    if (user) {
      navigate('/login');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center'>
      <div className='mt-36 bg-white p-8 rounded shadow-md w-5/12 h-2/5'>
        <h1 className='text-xl font-bold mb-4 text-center'>サインアップ</h1>
        {error && (
          <p className='p-3 my-10 text-center text-red-500 rounded bg-red-100'>
            {getErrorMessage(error, 'signup')}
          </p>
        )}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='text-sm font-semibold' htmlFor='email'>
              メールアドレス
            </label>
            <input
              className='mt-1 w-full p-2 border border-gray-300 rounded'
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='メールアドレス'
              required
            />
          </div>
          <div>
            <label className='text-sm font-semibold' htmlFor='password'>
              パスワード
            </label>
            <input
              className='mt-1 w-full p-2 border border-gray-300 rounded'
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='パスワード'
              required
            />
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={loading}
              className='w-1/3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 disabled:bg-red-300'
            >
              サインアップ
            </button>
          </div>
        </form>
        <div className='mt-10 text-center text-sm text-gray-500'>
          <a href='/login' className='hover:text-gray-700'>
            すでにアカウントをお持ちの方はこちら
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
