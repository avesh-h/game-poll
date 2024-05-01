'use client';

import { useParams } from 'next/navigation';

import GameForm from '@/components/Form/GameForm';
import LoadingScreen from '@/components/LoadingScreen';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const GameFormPage = () => {
  //For client side
  const params = useParams();
  const gameId = params?.['game-id'];
  const { data, isLoading } = useGetSingleGameQuery(gameId);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <GameForm formData={data?.selectedGame} />
    </div>
  );
};

export default GameFormPage;
