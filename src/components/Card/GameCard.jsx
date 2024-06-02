'use client';

import React from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

const GameCard = ({ gameInfo, cardRowStyle, buttonStyle }) => {
  const handleCopyClipboard = () => {
    const gameDetails =
      `*Name* : ${gameInfo?.gameName || 'N/A'}\n\n` +
      `*Date* : ${dayjs(gameInfo?.gameDate)?.format('DD-MMM') || 'N/A'}\n\n` +
      `*Game Type* : ${
        gameInfo?.gameType === 'team' ? 'Team wise' : 'All'
      }\n\n` +
      `*Venue* : ${gameInfo?.nameOfVenue || 'N/A'}\n\n` +
      `*Start Time* : ${
        dayjs(gameInfo?.startTime)?.format('h:mm A') || 'N/A'
      }\n\n` +
      `*End Time* : ${
        dayjs(gameInfo?.endTime)?.format('h:mm A') || 'N/A'
      }\n\n` +
      `*Game Hours* : ${gameInfo?.totalHours || 'N/A'}\n\n` +
      `*No. of Players* : ${gameInfo?.noOfPlayers || 'N/A'}\n\n` +
      `*Booking Cost* : ${gameInfo?.totalAmount || 'N/A'}`;

    navigator.clipboard.writeText(gameDetails?.trim());
  };
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
      <Card>
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
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size="small" sx={buttonStyle}>
            <WhatsAppIcon />
            Share
          </Button>
          <Button size="small" sx={buttonStyle} onClick={handleCopyClipboard}>
            <ContentCopyIcon />
            Copy
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default GameCard;
