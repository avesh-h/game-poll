'use client';

import { Box, Card, FormControl, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';

import MuiButton from '../mui/MuiButton';
import MuiTextField from '../mui/MuiTextField';

//Add validation zod

const Signup = ({ content, login, onSubmit, loading }) => {
  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const { handleSubmit, register } = methods;

  return (
    <Stack direction={'row'} justifyContent={'center'} marginTop={5}>
      <Card
        sx={{
          width: '30%',
          minWidth: '250px',
          p: 2,
        }}
      >
        <Typography variant="h5" textAlign={'center'} paddingBottom={3}>
          {content.title}
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ gap: 3 }}>
              {!login && (
                <Stack gap={3}>
                  <Box>
                    <MuiTextField
                      label="First name"
                      name="firstName"
                      register={register}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      label="Last name"
                      name="lastName"
                      register={register}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      label="Phone"
                      name="phone"
                      register={register}
                    />
                  </Box>
                </Stack>
              )}
              <Box>
                <MuiTextField label="Email" name="email" register={register} />
              </Box>
              <Box>
                <MuiTextField
                  label={login ? 'Password' : 'Set Password'}
                  name="password"
                  register={register}
                />
              </Box>
              <Box>
                <MuiButton
                  type="submit"
                  variant={'contained'}
                  isLoading={loading}
                >
                  {content.buttonText}
                </MuiButton>
              </Box>
              {!login ? (
                <p>
                  Already have account?{' '}
                  <Link href="/login" style={{ textDecoration: 'underline' }}>
                    Sign in
                  </Link>
                </p>
              ) : (
                <p>
                  {"Don't have an account?"}{' '}
                  <Link
                    href="/register"
                    style={{ textDecoration: 'underline' }}
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </FormControl>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default Signup;
