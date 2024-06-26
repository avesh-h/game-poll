'use client';

import { useCallback } from 'react';

import { Box, Container, FormLabel, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import PlayerForm from './PlayerForm';
import { useResponsive } from '@/hooks/useResponsive';
import { findLoggedInMember } from '@/lib/utils/editPlayerDetails';
import { socialShareLinks } from '@/lib/utils/socialShareLinks';

const GameForm = ({ formData }) => {
  //TODO:Form Data Means the game Details change name

  const isSmallScreen = useResponsive('down', 'md');

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
    const allMembers = [];
    const membersOfTeamA = [];
    const membersOfTeamB = [];

    formData?.members?.forEach((p) => {
      const memberText = p?.playerName
        ? `${p?.playerIndex + 1}) ${p.playerName} - ${p.position || '-'}`
        : `${p?.playerIndex + 1}) -`;

      if (p?.team === 'teamA') {
        membersOfTeamA.push(memberText);
      } else if (p?.team === 'teamB') {
        membersOfTeamB.push(memberText);
      } else {
        allMembers.push(memberText);
      }
    });

    const allMembersText = allMembers.join(' \n');
    const membersOfAText = membersOfTeamA.join(' \n').trim();
    const membersOfBText = membersOfTeamB.join(' \n').trim();

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
          ? '*Team A* :\n' +
            membersOfAText +
            '\n\n*Team B* :\n' +
            membersOfBText
          : allMembersText
      }\n\n` +
      `*Register Here* : ${formData?.registerLink}\n` +
      `*Game Password* : ${formData?.gamePassword}`;

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
                isSmallScreen={isSmallScreen}
              />
            );
          })
        ) : (
          <Stack direction={!isSmallScreen ? 'row' : 'column'} width={'100%'}>
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
                    isSmallScreen={isSmallScreen}
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
                    isSmallScreen={isSmallScreen}
                  />
                );
              })}
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default GameForm;
