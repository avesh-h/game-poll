'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

import Signup from '@/components/Form/Signup';
import { authActions } from '@/lib/redux/authSlice';

const content = {
  title: 'Login',
  buttonText: 'Sign in',
};

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      if (res?.error?.includes('not verified')) {
        enqueueSnackbar(res?.error, { variant: 'info', persist: true });
      } else {
        enqueueSnackbar(res?.error, { variant: 'error' });
      }
    } else {
      router.push('/gamesList');
      dispatch(authActions.login());
    }
    setLoading(false);
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} loading={loading} login />
    </div>
  );
};

export default Login;
