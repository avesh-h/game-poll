'use client';

import { useCallback } from 'react';

import { FormLabel, Stack } from '@mui/material';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import PlayerForm from './PlayerForm';
import { findLoggedInMember } from '@/lib/utils/editPlayerDetails';

const GameForm = ({ formData }) => {
  const router = useRouter();
  const session = useSession();
  const params = useParams();
  const isAuth = Cookies.get('accessToken');

  const getAllPlayers = useCallback(() => {
    const addedPlayers = [];
    for (let i = 0; i < formData?.noOfPlayers; i++) {
      if (
        formData?.members?.[i] &&
        Object.values(formData?.members?.[i])?.length
      ) {
        addedPlayers.push(formData?.members[i]);
      } else {
        addedPlayers.push({});
      }
    }
    return addedPlayers;
  }, [formData]);

  return (
    <>
      <Stack alignItems={'center'}>
        <FormLabel id="demo-radio-buttons-group-label">
          Select Your Seat:
        </FormLabel>

        {formData &&
          getAllPlayers()?.map((player, ind, arr) => {
            return (
              <PlayerForm
                player={player}
                ind={ind}
                key={`${player?.playerName}-${ind}`}
                existPlayer={findLoggedInMember(arr)}
              />
            );
          })}
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
    </>
  );
};

export default GameForm;
