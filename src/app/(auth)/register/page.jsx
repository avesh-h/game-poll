'use client';

// eslint-disable-next-line import/no-unresolved
import React from 'react';

// eslint-disable-next-line import/order
import { useRouter } from 'next/navigation';

// eslint-disable-next-line import/no-unresolved
import { enqueueSnackbar } from 'notistack';

import Signup from '@/components/Form/Signup';
// eslint-disable-next-line import/no-unresolved
import { API_STATUS } from '@/constants/apiStatuses';
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
    if (res?.data?.status === API_STATUS.success) {
      enqueueSnackbar(res?.data?.message, { variant: 'info', persist: true });
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
