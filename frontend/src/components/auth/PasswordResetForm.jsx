import { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [isSended, setIsSended] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendPasswordResetEmail(email);
    setIsSended(true);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center'>
      <div className='mt-36 bg-white p-8 rounded shadow-md w-5/12 h-2/5'>
        <h1 className='text-xl font-bold mb-4 text-center'>パスワード再設定</h1>
        {error && (
          <p className='p-3 my-10 text-center text-red-500 rounded bg-red-100'>
            パスワード再設定用リンクの送信に失敗しました。
          </p>
        )}
        {isSended && (
          <p className='p-3 my-10 text-center text-green-700 rounded bg-green-100'>
            パスワード再設定用リンクを送信しました。
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

          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={sending}
              className='w-1/3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 disabled:bg-red-300'
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
