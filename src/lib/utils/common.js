import dayjs from 'dayjs';

import { findOrganizerOfGame } from '@/lib/utils/editPlayerDetails';

export const gameDetails = ({ session, gameInfo }) => {
  return (
    `*Game* : ${gameInfo?.gameName || 'N/A'}\n\n` +
    `*Date* : ${dayjs(gameInfo?.gameDate)?.format('DD-MMM') || 'N/A'}\n\n` +
    `*Game type* : ${gameInfo?.gameType === 'team' ? 'Team wise' : 'All'}\n\n` +
    `*Organized by* : ${
      session?.user?.email ||
      findOrganizerOfGame(gameInfo?.members)?.playerName ||
      'N/A'
    }\n\n` +
    `*Venue* : ${gameInfo?.nameOfVenue || 'N/A'}\n\n` +
    `*Start time* : ${
      dayjs(gameInfo?.startTime)?.format('h:mm A') || 'N/A'
    }\n\n` +
    `*End time* : ${dayjs(gameInfo?.endTime)?.format('h:mm A') || 'N/A'}\n\n` +
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
};
