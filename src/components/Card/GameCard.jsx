'use client';

import { useCallback, useMemo } from 'react';

import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { EmailShareButton, WhatsappShareButton } from 'react-share';

import ClipBoardButton from '../Buttons/ClipBoardButton';
import ElementsTooltip from '../ElementTooltip';
import { findOrganizerOfGame } from '@/lib/utils/editPlayerDetails';

const GameCard = ({ gameInfo, cardRowStyle, buttonStyle }) => {
  //Clipboard text
  const copyText = useMemo(() => {
    return (
      `*Name* : ${gameInfo?.gameName || 'N/A'}\n\n` +
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
      `*Note* : ${gameInfo?.note || 'N/A'}\n\n` +
      '*-----------Register Link--------------*\n\n' +
      `Register Here : ${gameInfo?.registerLink}`
    );
  }, [
    gameInfo?.endTime,
    gameInfo?.gameDate,
    gameInfo?.gameName,
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

  //Social shares
  const socialShareLinks = useCallback(() => {
    const link = gameInfo?.registerLink;
    if (link) {
      return (
        <>
          <EmailShareButton
            subject="Game Timing"
            body={copyText}
            url={''}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MailIcon sx={{ pr: 0.5 }} />
            Share via Mail
          </EmailShareButton>
          <WhatsappShareButton
            url={copyText}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <WhatsAppIcon sx={{ pr: 0.5 }} />
            Share on WhatsApp
          </WhatsappShareButton>
        </>
      );
    }
    return null;
  }, [copyText, gameInfo?.registerLink]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: 'calc(100vh - 70px)', // Assuming the navbar height is 70px, adjust as necessary
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <Card sx={{ my: 2 }}>
        <ClipBoardButton
          buttonStyle={buttonStyle}
          copyText={copyText?.trim()}
        />
        <CardContent>
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
            {socialShareLinks()}
          </Stack>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default GameCard;
