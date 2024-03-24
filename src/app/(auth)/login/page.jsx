'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

// eslint-disable-next-line import/no-unresolved
import Signup from '@/components/Form/Signup';
// eslint-disable-next-line import/no-unresolved
import { useLoginMutation } from '@/lib/actions/authActions';
import { enqueueSnackbar } from 'notistack';

const content = {
  title: 'Login',
  buttonText: 'Sign in',
};

const page = () => {
  const router = useRouter();
  const session = useSession();

  console.log('session', session);
  // const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data, e) => {
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    console.log('resssss', res);
    if (res?.error) {
      enqueueSnackbar(res?.error, { variant: 'error' });
    } else {
      router.push('/dashboard');
    }
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} login />
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default page;
