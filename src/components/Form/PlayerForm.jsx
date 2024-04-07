import { isAllowToEditPlayersDetails } from '@/lib/utils/editPlayerDetails';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
import MuiSelect from '../mui/MuiSelect';
import MuiTextField from '../mui/MuiTextField';
import { useParams } from 'next/navigation';
import { useAddPlayerMutation } from '@/lib/actions/gameActions';

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
    playerName: player?.name || '',
    position: player?.position || '',
  });
  const { register, handleSubmit, watch, reset } = methods;
  const params = useParams();
  const [addPlayer, { isLoading }] = useAddPlayerMutation();

  const onSubmit = async (playerData) => {
    console.log('playerData', playerData);
    if (Object.values(playerData)?.length && params?.['game-id']) {
      playerData.gameId = params?.['game-id'];
      const res = await addPlayer(playerData);
    }
    // reset();
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
                value={player?.name}
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
              <Button type="submit">Submit</Button>
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
