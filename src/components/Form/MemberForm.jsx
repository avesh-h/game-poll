'use client';

//Landing page for the members who click on the link
import {
  Box,
  Button,
  Card,
  FormControl,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import MuiTextField from '../mui/MuiTextField';

import { useAddMemberMutation } from '@/lib/actions/memberActions';

const MemberForm = () => {
  const methods = useForm({ email: '', name: '', gamePassword: '' });
  const params = useParams();
  const [addMember, { isLoading }] = useAddMemberMutation();
  const { handleSubmit, register, reset } = methods;

  const onSubmit = async (memberData) => {
    const gameId = params?.['gameId'];
    if (gameId) {
      console.log('memberData', memberData);
      memberData.gameId = gameId;
      const response = await addMember(memberData);
      console.log('res', response);
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
          Player Details
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
            </FormControl>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default MemberForm;
