'use client';

import { useMemo } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';

import ClipBoardButton from '../Buttons/ClipBoardButton';
import ElementsTooltip from '../ElementTooltip';
import { findOrganizerOfGame } from '@/lib/utils/editPlayerDetails';
import { socialShareLinks } from '@/lib/utils/socialShareLinks';

const cardRowStyle = {
  direction: 'row',
  alignItems: 'center',
  gap: 2,
  py: 1.5,
};

const buttonStyle = {
  position: 'absolute',
  right: 0,
  padding: 1,
};

const GameCard = ({ gameInfo }) => {
  const location = usePathname();
  const isDetailPage = location?.includes('gamesList');

  //Clipboard text
  const copyText = useMemo(() => {
    return (
      `*Game* : ${gameInfo?.gameName || 'N/A'}\n\n` +
      `*Date* : ${dayjs(gameInfo?.gameDate)?.format('DD-MMM') || 'N/A'}\n\n` +
      `*Game type* : ${
        gameInfo?.gameType === 'team' ? 'Team wise' : 'All'
      }\n\n` +
      `*Organized by* : ${
        findOrganizerOfGame(gameInfo?.members)?.playerName || 'N/A'
      }\n\n` +
      `*Venue* : ${gameInfo?.nameOfVenue || 'N/A'}\n\n` +
      `*Start time* : ${
        dayjs(gameInfo?.startTime)?.format('h:mm A') || 'N/A'
      }\n\n` +
      `*End time* : ${
        dayjs(gameInfo?.endTime)?.format('h:mm A') || 'N/A'
      }\n\n` +
      `*Game duration* : ${gameInfo?.totalHours + ' hrs' || 'N/A'}\n\n` +
      `*No. of players* : ${gameInfo?.noOfPlayers || 'N/A'}\n\n` +
      `*Booking cost* : ${gameInfo?.totalAmount || 'N/A'}\n\n` +
      `*Player cost* : ${
        Math.ceil(gameInfo?.totalAmount / gameInfo?.noOfPlayers) || 'N/A'
      }\n\n` +
      `*Note* : ${gameInfo?.note || 'N/A'}\n\n` +
      '*-----------Register Link--------------*\n\n' +
      `*Register Here* : ${gameInfo?.registerLink}\n` +
      `*Game Password* : ${gameInfo?.gamePassword}`
    );
  }, [
    gameInfo?.endTime,
    gameInfo?.gameDate,
    gameInfo?.gameName,
    gameInfo?.gamePassword,
    gameInfo?.gameType,
    gameInfo?.members,
    gameInfo?.nameOfVenue,
    gameInfo?.noOfPlayers,
    gameInfo?.note,
    gameInfo?.registerLink,
    gameInfo?.startTime,
    gameInfo?.totalAmount,
    gameInfo?.totalHours,
  ]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        ...(isDetailPage ? { minHeight: 'calc(100vh - 70px)' } : {}), // Assuming the navbar height is 70px, adjust as necessary
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <Card sx={{ position: 'relative' }}>
        <ClipBoardButton
          buttonStyle={buttonStyle}
          copyText={copyText?.trim()}
        />
        <CardContent sx={{ pt: 0 }}>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Game name :
            </Typography>
            <Typography component="div">
              {gameInfo?.gameName || 'N/A'}
            </Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Date :
            </Typography>
            <Typography component="div">
              {dayjs(gameInfo?.gameDate)?.format('DD-MMM') || 'N/A'}
            </Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Game type :
            </Typography>
            <Typography>
              {gameInfo?.gameType === 'team' ? 'Team wise' : 'All'}
            </Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Venue :
            </Typography>
            <Typography>{gameInfo?.nameOfVenue || 'N/A'}</Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Start time :
            </Typography>
            <Typography>
              {dayjs(gameInfo?.startTime)?.format('h:mm A') || 'N/A'}
            </Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              End time :
            </Typography>
            <Typography>
              {dayjs(gameInfo?.endTime).format('h:mm A') || 'N/A'}
            </Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Game hours :
            </Typography>
            <Typography>{gameInfo?.totalHours || 'N/A'}</Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              No.of players :
            </Typography>
            <Typography>{gameInfo?.noOfPlayers || 'N/A'}</Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Booking Cost :
            </Typography>
            <Typography>{gameInfo?.totalAmount || 'N/A'}</Typography>
          </Stack>
          <Stack {...cardRowStyle}>
            <Typography sx={{ fontSize: 15 }} color="text.secondary">
              Register Link :
            </Typography>
            <ElementsTooltip
              upperElement={gameInfo?.registerLink}
              maxLengthOfUpperElement={25}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack
            direction={'row'}
            width={'100%'}
            justifyContent="space-between"
          >
            {socialShareLinks(copyText, {
              emailBtnText: 'Share via email',
              whatsappBtnText: 'Share on whatsapp',
            })}
          </Stack>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default GameCard;
