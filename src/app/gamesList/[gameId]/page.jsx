'use client';

import GameCard from '@/components/Card/GameCard';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const cardRowStyle = {
  direction: 'row',
  alignItems: 'center',
  gap: 2,
  py: 1.5,
};

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 0.5,
};

//This async component
const GameInfoPage = ({ params }) => {
  const { data: gameDetails, isLoading } = useGetSingleGameQuery(
    params?.gameId
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <GameCard
      gameInfo={gameDetails?.selectedGame}
      cardRowStyle={cardRowStyle}
      buttonStyle={buttonStyle}
    />
  );
};

export default GameInfoPage;
