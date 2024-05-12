'use client';

import { useCallback } from 'react';

import { Box, Container, FormLabel, Stack, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import PlayerForm from './PlayerForm';
import { findLoggedInMember } from '@/lib/utils/editPlayerDetails';

const GameForm = ({ formData }) => {
  //TODO:Form Data Means the game Details change name
  const router = useRouter();
  const session = useSession();
  const params = useParams();
  const isAuth = Cookies.get('accessToken');

  const getAllPlayers = useCallback(() => {
    let addedPlayers = [];
    let teamPlayers = {
      teamA: [],
      teamB: [],
    };

    for (let i = 0; i < formData?.noOfPlayers; i++) {
      if (formData?.gameType === 'team') {
        teamPlayers[formData?.members?.[i]?.team][
          formData?.members?.[i]?.playerIndex
        ] = formData.members[i];
      } else {
        //Game type "All"
        addedPlayers[formData?.members?.[i]?.playerIndex] =
          formData?.members?.[i];
      }
    }

    return formData?.gameType === 'team' ? teamPlayers : addedPlayers;
  }, [formData]);

  return (
    <Container>
      <Stack alignItems={'center'}>
        <FormLabel id="demo-radio-buttons-group-label">
          Select Your Seat:
        </FormLabel>

        {formData && formData?.gameType === 'all' ? (
          getAllPlayers()?.map((player, ind, arr) => {
            return (
              <PlayerForm
                player={player}
                ind={ind}
                key={`${player?.playerName}-${ind}`}
                existPlayer={findLoggedInMember(arr)}
              />
            );
          })
        ) : (
          <Stack direction={'row'} width={'100%'}>
            <Box width={'100%'}>
              <Typography>Team A</Typography>
              {getAllPlayers()?.teamA?.map((player, ind, arr) => {
                return (
                  <PlayerForm
                    player={player}
                    ind={ind}
                    key={`${player?.playerName}-${ind}`}
                    existPlayer={findLoggedInMember(arr)}
                    team={'teamA'}
                  />
                );
              })}
            </Box>
            <Box width={'100%'}>
              <Typography>Team B</Typography>
              {getAllPlayers()?.teamB?.map((player, ind, arr) => {
                return (
                  <PlayerForm
                    player={player}
                    ind={ind}
                    key={`${player?.playerName}-${ind}`}
                    existPlayer={findLoggedInMember(arr)}
                    team={'teamB'}
                  />
                );
              })}
            </Box>
          </Stack>
        )}
      </Stack>
      {/* Temporary logout without design */}
      <button
        onClick={() => {
          if (session?.data?.user?.id) {
            //session logout for organizer
            signOut();
            //redirect to login
            router.push('/login');
          } else {
            //member logout
            if (isAuth) {
              localStorage.removeItem('session-user');
              Cookies.remove('accessToken');
            }
            //redirect to member login
            router.push(`/members/${params?.['game-id']}`);
          }
        }}
      >
        Logout
      </button>
    </Container>
  );
};

export default GameForm;
