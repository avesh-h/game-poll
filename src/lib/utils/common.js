import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { findOrganizerOfGame } from '@/lib/utils/editPlayerDetails';

dayjs.extend(utc);
dayjs.extend(timezone);

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
      dayjs(gameInfo?.startTime)?.tz('Asia/Kolkata')?.format('h:mm A') || 'N/A'
    }\n\n` +
    `*End time* : ${
      dayjs(gameInfo?.endTime)?.tz('Asia/Kolkata')?.format('h:mm A') || 'N/A'
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
};

// Function to convert user input date to cron expression
export function getDateIntoCronExpression(endTime) {
  // # ┌────────────── second (optional)
  // # │ ┌──────────── minute
  // # │ │ ┌────────── hour
  // # │ │ │ ┌──────── day of month
  // # │ │ │ │ ┌────── month
  // # │ │ │ │ │ ┌──── day of week
  // # │ │ │ │ │ │
  // # │ │ │ │ │ │
  // # * * * * * *
  const date = new Date(endTime);
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay() + 1; // node-cron uses 1-7 for days of the week

  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function getDateIntoCronRestExpression(endTime) {
  const date = new Date(endTime);
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay() + 1; // node-cron uses 1-7 for days of the week

  return {
    minutes: [minutes],
    hours: [hours],
    mdays: [dayOfMonth],
    months: [month],
    wdays: [dayOfWeek],
  };
}
