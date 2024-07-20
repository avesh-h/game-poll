'use client';

import GameCard from '@/components/Card/GameCard';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

//This async component
const GameInfoPage = ({ params }) => {
  const { data: gameDetails, isLoading } = useGetSingleGameQuery(
    params?.gameId
  );

  if (isLoading) {
    return <Loader />;
  }
  return <GameCard gameInfo={gameDetails?.selectedGame} />;
};

export default GameInfoPage;
