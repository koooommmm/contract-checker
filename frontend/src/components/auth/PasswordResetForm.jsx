import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [sendPasswordResetEmail, sending, _, error] =
    useSendPasswordResetEmail(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendPasswordResetEmail(email);
    alert('パスワード再設定用のリンクをメールで送信いたしました。');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='メールアドレス'
          required
        />
        <button type='submit' disabled={sending}>
          送信
        </button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
};

export default PasswordResetForm;
