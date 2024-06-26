'use client';

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

  const onSubmit = async (data) => {
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      enqueueSnackbar(res?.error, { variant: 'error' });
    } else {
      router.push('/create-game');
      dispatch(authActions.login());
    }
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} login />
    </div>
  );
};

export default Login;
