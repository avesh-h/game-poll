'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

// eslint-disable-next-line import/no-unresolved
import Signup from '@/components/Form/Signup';
// eslint-disable-next-line import/no-unresolved
import { useLoginMutation } from '@/lib/actions/authActions';

const content = {
  title: 'Login',
  buttonText: 'Sign in',
};

const page = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data, e) => {
    const res = await login(data);
    if (res?.data?.status === 'success') {
      router.push('/dashboard');
    }
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} login />
    </div>
  );
};

export default page;
