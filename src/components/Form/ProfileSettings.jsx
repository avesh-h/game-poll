'use client';

import React, { useState } from 'react';

import {
  Box,
  Stack,
  Card,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import MuiButton from '../mui/MuiButton';
import MuiTextField from '../mui/MuiTextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ProfileSettings = () => {
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = () => {};

  const { handleSubmit, register } = methods;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Stack direction={'row'} justifyContent={'center'} my={4}>
      <Card
        sx={{
          width: '30%',
          minWidth: '250px',
          p: 2,
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Profile settings</h3>
            <Stack gap={3} pt={2}>
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
                <MuiTextField label="Phone" name="phone" register={register} />
              </Box>
              <Box>
                <MuiTextField
                  label="Email"
                  name="email"
                  register={register}
                  disabled={true}
                />
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
                  // isLoading={loading}
                >
                  Update
                </MuiButton>
              </Box>
            </Stack>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default ProfileSettings;
