'use client';

// eslint-disable-next-line import/no-unresolved
import React from 'react';

import { useRouter } from 'next/navigation';

// eslint-disable-next-line import/no-unresolved
import Signup from '@/components/Form/Signup';
// eslint-disable-next-line import/no-unresolved
import { useSignupMutation } from '@/lib/actions/authActions';

const content = {
  title: 'Sign up',
  buttonText: 'Submit',
};
const SignupPage = () => {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (data) => {
    const res = await signup(data);
    if (res.status === 'success') {
      router.push('/login');
    }
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} loading={isLoading} />
    </div>
  );
};

export default SignupPage;
