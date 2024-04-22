'use client';

import { useParams } from 'next/navigation';

import GameForm from '@/components/Form/GameForm';
import LoadinScreen from '@/components/LoadinScreen';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const GameFormPage = () => {
  //For client side
  const params = useParams();
  const gameId = params?.['game-id'];
  const { data, isLoading } = useGetSingleGameQuery(gameId);

  if (isLoading) {
    return <LoadinScreen />;
  }
  return (
    <div>
      <GameForm formData={data?.selectedGame} />
    </div>
  );
};

export default GameFormPage;
