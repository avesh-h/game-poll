'use client';

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

import ElementsTooltip from '../ElementTooltip';
import { findOrganizerOfGame } from '@/lib/utils/editPlayerDetails';

const GameCard = ({ gameInfo, cardRowStyle, buttonStyle }) => {
  const handleCopyClipboard = () => {
    const gameDetails =
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
      `Register Here : ${gameInfo?.registerLink}`;

    //Navigator browser API
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
