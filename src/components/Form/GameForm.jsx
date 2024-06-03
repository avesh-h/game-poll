'use client';

import { useCallback } from 'react';

import { Box, Container, FormLabel, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import PlayerForm from './PlayerForm';
import { findLoggedInMember } from '@/lib/utils/editPlayerDetails';
import { socialShareLinks } from '@/lib/utils/socialShareLinks';

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

  const copyText = () => {
    // const membersText = formData?.members
    //   ?.map((p, i) => {
    //     return p?.playerName
    //       ? `${formData?.gameType === 'team' && i === 0 ? '*Team A* :\n' : ''}${
    //           i + 1
    //         }) ${p.playerName} - ${p.position || '-'}${
    //           formData?.gameType === 'team' &&
    //           i > Math.ceil(formData?.noOfPlayers / 2)
    //             ? '\n\n*Team B* :\n'
    //             : ''
    //         }`
    //       : `${i + 1}) -`;
    //   })
    //   ?.join(' \n');

    const allMembers = formData?.members
      ?.map((p, i) =>
        p?.playerName
          ? `${i + 1}) ${p.playerName} - ${p.position || '-'}`
          : `${i + 1}) -`
      )
      ?.join(' \n');

    const membersOfA = formData?.members
      ?.map((p, i) =>
        p?.team === 'teamA' && p?.playerName
          ? `${i + 1}) ${p.playerName} - ${p.position || '-'}`
          : i < Math.ceil(formData?.noOfPlayers / 2)
          ? `${i + 1}) -`
          : ''
      )
      ?.join(' \n')
      ?.trim();

    const membersOfB = formData?.members
      ?.map((p, i) =>
        p?.team === 'teamB' && p?.playerName
          ? `${i + 1}) ${p.playerName} - ${p.position || '-'}`
          : i < Math.ceil(formData?.noOfPlayers / 2)
          ? `${i + 1}) -`
          : ''
      )
      ?.join(' \n')
      ?.trim();

    const fullText =
      `*Date* : ${dayjs(formData?.gameDate)?.format('DD-MMM') || 'N/A'}\n` +
      `*Venue* : ${formData?.nameOfVenue || 'N/A'}\n` +
      `*Game time* : ${
        dayjs(formData?.startTime)?.format('h:mm A') +
        ' To ' +
        dayjs(formData?.endTime)?.format('h:mm A')
      }\n` +
      `${formData?.gameType === 'all' ? '\n*Players list* :' : ''}\n` +
      `${
        formData?.gameType === 'team'
          ? '*Team A* :\n' + membersOfA + '\n\n*Team B* :\n' + membersOfB
          : allMembers
      }\n\n` +
      // `${membersText}\n\n` +
      `*Register Here* : ${formData?.registerLink}`;

    return fullText;
  };

  return (
    <Container>
      <Box>
        <Typography textAlign={'center'}>
          After making the change in below list you can share updated list in
          whatsapp or via mail.
        </Typography>
        <Stack direction={'row'} gap={2} pt={2}>
          {socialShareLinks(copyText(), {
            emailBtnText: 'Share via email',
            whatsappBtnText: 'Share on whatsapp',
          })}
        </Stack>
      </Box>

      <Stack alignItems={'center'} pt={2}>
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
