'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line import/no-unresolved
import Signup from '@/components/Form/Signup';
// eslint-disable-next-line import/no-unresolved
import { enqueueSnackbar } from 'notistack';

const content = {
  title: 'Login',
  buttonText: 'Sign in',
};

const Login = () => {
  const router = useRouter();
  const session = useSession();

  console.log('session', session);
  // const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data, e) => {
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });
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

export default Login;
