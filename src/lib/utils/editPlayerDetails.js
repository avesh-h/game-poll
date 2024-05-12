import { GAME_MEMBER, GAME_ORGANIZER } from '@/constants/role';

export const isAllowToEditPlayersDetails = (player, sessionId) => {
  const flag =
    (sessionId ||
      (player?.role === GAME_MEMBER &&
        player?.id === localMember()?.memberId)) &&
    player?.playerName &&
    player?.position;
  return !!flag;
};

export const currentLoggedInUserRole = () => {
  const isMember = localStorage.getItem('session-user');

  return isMember ? GAME_MEMBER : GAME_ORGANIZER;
};

export const isMemberLoggedIn = () => localStorage.getItem('session-user');

export const restrictToEditOtherMembersDetails = () => {};

export const disableSubmit = () => {};

export const localMember = () => {
  return JSON.parse(localStorage.getItem('session-user'));
};

export const validateLoggedInUserByID = (player, sessionId) =>
  (player?.role === GAME_ORGANIZER && sessionId === player?.id) ||
  (player?.role === GAME_MEMBER && player?.id === localMember()?.memberId);

export const findLoggedInMember = (membersArr) => {
  return membersArr?.find((m) => m?.id === localMember()?.memberId);
};
