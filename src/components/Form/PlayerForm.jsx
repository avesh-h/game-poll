/* eslint-disable import/no-unresolved */
'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';

import MuiSelect from '../mui/MuiSelect';
import MuiTextField from '../mui/MuiTextField';
import { GAME_MEMBER } from '@/constants/role';
import { useAddPlayerMutation } from '@/lib/actions/gameActions';
import { isAllowToEditPlayersDetails } from '@/lib/utils/editPlayerDetails';

const playingPositions = [
  'ST',
  'GK',
  'LW',
  'RW',
  'CAM',
  'CDM',
  'CM',
  'RM',
  'LM',
  'CB',
  'RB',
  'LB',
];

const PlayerForm = ({ player, ind }) => {
  const session = useSession();
  const methods = useForm({
    playerName: player?.playerName || '',
    position: player?.position || '',
  });
  const { register, handleSubmit, watch, reset } = methods;
  const params = useParams();
  const [addPlayer, { isLoading }] = useAddPlayerMutation();

  //STATE
  const playerName = watch('playerName');
  const position = watch('position');

  const onSubmit = async (playerData) => {
    if (Object.values(playerData)?.length && params?.['game-id']) {
      playerData.gameId = params?.['game-id'];
      let memberId, email;

      if (localStorage.getItem('session-user')) {
        const memberObj = JSON.parse(localStorage.getItem('session-user'));
        memberId = memberObj?.memberId;
        email = memberObj?.email;
      } else {
        memberId = session?.data?.user?.id;
        email = session?.data?.user?.email;
      }
      playerData.email = email;
      playerData.id = memberId;
      playerData.role = player?.role || GAME_MEMBER;
      const res = await addPlayer(playerData);
    }
  };

  return (
    <FormProvider {...methods}>
      <form style={{ width: '80%' }} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={'row'} alignItems={'center'}>
          <Typography pr={2}>{ind + 1}</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={4}>
              <MuiTextField
                label="Enter your name"
                name="playerName"
                value={player?.playerName}
                register={register}
              />
            </Grid>
            <Grid item xs={2}>
              <MuiSelect
                title={'Position'}
                options={playingPositions}
                name="position"
                value={player?.position}
                register={register}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                disabled={isLoading || !(playerName && position)}
              >
                Submit
              </Button>
            </Grid>
            {/* Session id of member that redirected for add in the seats */}
            {isAllowToEditPlayersDetails(player, session?.data?.user?.id) && (
              <Grid item xs={2}>
                <Button>
                  <EditIcon />
                </Button>
              </Grid>
            )}
          </Grid>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default PlayerForm;
