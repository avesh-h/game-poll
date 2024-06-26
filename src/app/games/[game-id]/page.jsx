'use client';

import { useParams } from 'next/navigation';

import GameForm from '@/components/Form/GameForm';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const GameFormPage = () => {
  //For client side
  const params = useParams();
  const gameId = params?.['game-id'];
  //Refetch everytime when user come to page it will not get data from the cache for this API
  const { data, isLoading } = useGetSingleGameQuery(gameId, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <GameForm formData={data?.selectedGame} />
    </div>
  );
};

export default GameFormPage;
