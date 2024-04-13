/* eslint-disable import/no-unresolved */
import { GAME_MEMBER, GAME_ORGANIZER } from '@/constants/role';

export const isAllowToEditPlayersDetails = (player, sessionId) => {
  const flag =
    ((player?.role === GAME_ORGANIZER && sessionId === player?.id) ||
      sessionId === player?.id) &&
    player?.name &&
    player?.position;
  return flag;
};

export const currentLoggedInUserRole = () => {
  const isMember = localStorage.getItem('session-user');

  return isMember ? GAME_MEMBER : GAME_ORGANIZER;
};

export const isMemberLoggedIn = () => localStorage.getItem('session-user');

export const restrictToEditOtherMembersDetails = (playerId) => {};

export const disableSubmit = () => {};
