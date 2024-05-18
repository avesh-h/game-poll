'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';

import MuiSelect from '../mui/MuiSelect';
import MuiTextField from '../mui/MuiTextField';
import PlayerNameCard from '../PlayerNameCard';
import { API_STATUS } from '@/constants/apiStatuses';
import { GAME_MEMBER } from '@/constants/role';
import {
  useAddPlayerMutation,
  useGetSingleGameQuery,
} from '@/lib/actions/gameActions';
import { useRemoveMemberMutation } from '@/lib/actions/memberActions';
import { localMember } from '@/lib/utils/editPlayerDetails';

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

const PlayerForm = ({ player, ind, existPlayer, team }) => {
  const session = useSession();
  const [isEdit, setIsEdit] = useState(false);
  const methods = useForm({
    playerName: player?.playerName || '',
    position: player?.position || '',
  });
  const { register, handleSubmit, watch, setValue } = methods;
  const params = useParams();
  const { data: gameDetails } = useGetSingleGameQuery(params?.['game-id']);
  const [addPlayer, { isLoading }] = useAddPlayerMutation();
  const [removeMember, { isLoading: isDeleting }] = useRemoveMemberMutation();

  //Existed Member In Game
  const existedMemberInGame = useMemo(() => {
    if (localStorage.getItem('session-user')) {
      const existedMember = JSON.parse(localStorage.getItem('session-user'));
      return gameDetails?.selectedGame?.members?.find(
        (m) => m.id === existedMember?.memberId
      );
    }
  }, [gameDetails?.selectedGame?.members]);

  //STATE
  const playerName = watch('playerName');
  const position = watch('position');

  //For set value for first time
  useEffect(() => {
    setValue('playerName', player?.playerName);
    setValue('position', player?.position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (playerData) => {
    if (Object.values(playerData)?.length && params?.['game-id']) {
      playerData.gameId = params?.['game-id'];
      let memberId, email;

      const memberExist = gameDetails?.selectedGame?.members?.find((member) =>
        member?.id
          ? member?.id === session?.data?.user?.id ||
            member?.id === localMember()?.memberId
          : null
      );
      //Check for admin is adding member.
      if (localStorage.getItem('session-user')) {
        const memberObj = JSON.parse(localStorage.getItem('session-user'));
        memberId = memberObj?.memberId;
        email = memberObj?.email;
      } else {
        memberId = session?.data?.user?.id;
        email = session?.data?.user?.email;
      }
      if (player?.id) {
        playerData.id = player?.id;
        playerData.email = player?.email;
      } else {
        if (!memberExist) {
          playerData.id = memberId;
          playerData.email = email;
        }
      }
      playerData.role = player?.role || GAME_MEMBER;
      playerData.playerIndex = ind;
      playerData.memberIndex = player?.memberIndex;

      if (gameDetails?.selectedGame?.gameType === 'team') {
        playerData.team = team;
      }
      const res = await addPlayer(playerData);
      if (res?.data?.status === API_STATUS?.success) {
        setIsEdit(false);
      }
    }
  };

  //TODO: Before this add modal for are you sure you want to remove this player
  const handleRemovePlayer = useCallback(
    async (playerDetails) => {
      if (playerDetails) {
        const response = await removeMember({
          id: playerDetails?.id,
          gameId: playerDetails?.gameId,
        });
        if (response?.data?.status === API_STATUS?.success) {
          enqueueSnackbar(response?.data?.message, { variant: 'success' });
        }
      }
    },
    [removeMember]
  );

  return (
    <FormProvider {...methods}>
      <form style={{ width: '80%' }} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={'row'} alignItems={'center'} pt={2}>
          <Typography pr={2}>{ind + 1}</Typography>
          {!isEdit &&
          Object?.values(player)?.length &&
          'position' in player &&
          'playerName' in player ? (
            <PlayerNameCard
              player={player}
              setIsEdit={setIsEdit}
              session={session}
              removeHandler={handleRemovePlayer}
            />
          ) : (
            <Grid container spacing={2} mt={1}>
              <Grid item xs={4}>
                <MuiTextField
                  label="Enter your name"
                  name="playerName"
                  register={register}
                  disabled={
                    (!session?.data &&
                      (existPlayer?.id !== player?.id ||
                        existedMemberInGame?.id !== player?.id)) ||
                    isLoading
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <MuiSelect
                  title={'Position'}
                  options={playingPositions}
                  name="position"
                  register={register}
                  disabled={
                    (!session?.data &&
                      (existPlayer?.id !== player?.id ||
                        existedMemberInGame?.id !== player?.id)) ||
                    isLoading
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  disabled={isLoading || !(playerName && position)}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
};

export default PlayerForm;
