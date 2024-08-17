'use client';

import { useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Card,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';

import MuiButton from '../mui/MuiButton';
import MuiTextField from '../mui/MuiTextField';

//Add validation zod

const Signup = ({ content, login, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
                <FormControl variant="outlined">
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ lineHeight: '1em' }}
                  >
                    Password
                  </InputLabel>

                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    sx={{
                      '.MuiInputBase-input.MuiOutlinedInput-input': {
                        padding: '12px 14px',
                      },
                    }}
                    inputProps={{ ...register('password') }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
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
