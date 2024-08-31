'use client';

import { useEffect, useState } from 'react';

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
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';

import Loader from '../Loader/loader';
import MuiButton from '../mui/MuiButton';
import MuiTextField from '../mui/MuiTextField';
import { API_STATUS } from '@/constants/apiStatuses';
import {
  useEditProfileMutation,
  useGetProfileDetailsQuery,
} from '@/lib/actions/profileActions';

const ProfileSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const session = useSession();
  const [editProfile, { isLoading: isEditing }] = useEditProfileMutation();

  const { data, isLoading } = useGetProfileDetailsQuery(
    session?.data?.user?.id,
    {
      skip: !session?.data,
    }
  );

  const methods = useForm({
    defaultValues: {
      firstName: data?.profileData?.firstName || '',
      lastName: data?.profileData?.lastName || '',
      email: data?.profileData?.email || '',
      phone: data?.profileData?.phone || '',
      oldPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (payload) => {
    if (session?.data) {
      const payloadObj = {
        ...payload,
        id: session?.data?.user?.id,
      };
      const res = await editProfile(payloadObj);
      if (res?.data?.status === API_STATUS.success) {
        enqueueSnackbar(res?.data?.message, { variant: 'success' });
        reset();
      }
    } else {
      enqueueSnackbar('Profile Id not found!', { variant: 'error' });
    }
  };

  const { handleSubmit, register, reset } = methods;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (data?.profileData) {
      reset({
        firstName: data?.profileData?.firstName || '',
        lastName: data?.profileData?.lastName || '',
        phone: data?.profileData?.phone || '',
        email: data?.profileData?.email || '',
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [data?.profileData, reset]);

  if (isLoading) {
    return <Loader />;
  }

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
                <FormControl variant="outlined" sx={{ width: '100%' }}>
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ lineHeight: '1em' }}
                  >
                    Old Password
                  </InputLabel>

                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="oldPassword"
                    type={showPassword ? 'text' : 'password'}
                    sx={{
                      '.MuiInputBase-input.MuiOutlinedInput-input': {
                        padding: '12px 14px',
                      },
                    }}
                    inputProps={{ ...register('oldPassword') }}
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
                    label="Old Password"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl variant="outlined" sx={{ width: '100%' }}>
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ lineHeight: '1em' }}
                  >
                    New Password
                  </InputLabel>

                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    sx={{
                      '.MuiInputBase-input.MuiOutlinedInput-input': {
                        padding: '12px 14px',
                      },
                    }}
                    inputProps={{ ...register('newPassword') }}
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
                    label="New Password"
                  />
                </FormControl>
              </Box>
              <Box>
                <MuiButton
                  type="submit"
                  variant={'contained'}
                  isLoading={isEditing}
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
