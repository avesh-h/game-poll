/* eslint-disable import/namespace */
/* eslint-disable import/no-unresolved */
'use client';

import { useCallback } from 'react';

import { FormLabel, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import PlayerForm from './PlayerForm';
import useCookie from '@/lib/custom-hooks/useCookie';

const GameForm = ({ formData }) => {
  const router = useRouter();
  const session = useSession();
  const [value, , removeCookie] = useCookie('accessToken');
  const params = useParams();

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
          getAllPlayers()?.map((player, ind) => {
            return (
              <PlayerForm
                player={player}
                ind={ind}
                key={`${player?.playerName}-${ind}`}
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
            localStorage.removeItem('session-user');

            if (value) {
              removeCookie();
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
