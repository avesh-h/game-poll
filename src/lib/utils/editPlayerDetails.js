import { GAME_ORGANIZER } from '@/constants/role';

export const isAllowToEditPlayersDetails = (player, sessionId) => {
  const flag =
    ((player?.role === GAME_ORGANIZER && sessionId === player?.id) ||
      sessionId === player?.id) &&
    player?.name &&
    player?.position;
  return flag;
};
