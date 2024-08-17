'use client';

import { useState, useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  //Here make sure that use effect run only once and print the message for only one time with use of useRef hook
  const effectAlreadyRun = useRef(false);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message && !effectAlreadyRun?.current) {
      if (message.includes('failed')) {
        enqueueSnackbar('Account Verification failed!', { variant: 'error' });
      } else {
        enqueueSnackbar('Account Successfully verified!', { variant: 'info' });
      }
    }
    effectAlreadyRun.current = true;
  }, [searchParams]);

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
