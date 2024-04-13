/* eslint-disable import/no-unresolved */
'use client';

//Landing page for the members who click on the link
import { useState } from 'react';

import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Stack,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';

import MuiTextField from '../mui/MuiTextField';
import { API_STATUS } from '@/constants/apiStatuses';
import { useAddMemberMutation } from '@/lib/actions/memberActions';

const MemberForm = () => {
  const methods = useForm({ email: '', name: '', gamePassword: '' });
  const params = useParams();
  const [addMember, { isLoading, isSuccess }] = useAddMemberMutation();
  const { handleSubmit, register, reset } = methods;
  const router = useRouter();
  const [isNewMember, setIsNewMember] = useState(true);

  //Submit
  const onSubmit = async (memberData) => {
    const gameId = params?.['gameId'];
    if (gameId && Object.values(memberData)?.length) {
      const createMemberData = {
        ...memberData,
        gameId: gameId,
        isNewMember: isNewMember,
      };
      if ('email' in createMemberData && !createMemberData?.email) {
        delete createMemberData?.email;
      }
      const response = await addMember(createMemberData);

      if (response?.data?.status === API_STATUS?.success || isSuccess) {
        enqueueSnackbar('Successfully Added!', { variant: 'success' });
        //Store member session in local storage
        localStorage.setItem(
          'session-user',
          JSON.stringify({
            email: response?.data?.member?.email,
            memberId: response?.data?.member?._id || response?.data?.member?.id,
            name:
              response?.data?.member?.name ||
              response?.data?.member?.playerName,
            gameId: response?.data?.member?.gameId,
          })
        );
        reset();
        router.push(`/games/${gameId}`);
      }
    }
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
        <Typography variant="h6" textAlign={'center'} paddingBottom={3}>
          {isNewMember ? 'New Player Details' : 'Add Your Details'}
        </Typography>
        <FormProvider>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ gap: 3 }}>
              <Stack gap={3}>
                <Box>
                  <MuiTextField
                    label="Email (optional)"
                    name="email"
                    register={register}
                  />
                </Box>
                <Box>
                  <MuiTextField
                    label="Full name*"
                    name="name"
                    register={register}
                  />
                </Box>
              </Stack>
              <Box>
                <Typography sx={{ fontSize: '12px', pb: 1 }}>
                  Note: Game password can shared by game organizer.
                </Typography>
                <MuiTextField
                  label={'Game Password*'}
                  name="gamePassword"
                  register={register}
                />
              </Box>
              <Box>
                <Button type="submit">Submit</Button>
              </Box>
              <Divider />
              <Typography variant="h6" textAlign={'center'}>
                Sign in
              </Typography>
              <Stack direction={'row'} justifyContent={'space-around'}>
                <Button
                  sx={{ fontSize: '12px' }}
                  onClick={() => setIsNewMember((prev) => !prev)}
                >
                  {isNewMember ? 'As a player' : 'Add Player'}
                </Button>
                <Button
                  sx={{ fontSize: '12px' }}
                  onClick={() => router.push('/login')}
                >
                  As a Game organizer
                </Button>
              </Stack>
            </FormControl>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default MemberForm;
