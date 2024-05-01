'use client';

import { useParams } from 'next/navigation';

import CreateGameForm from '@/components/Form/CreateGameForm';
import LoadingScreen from '@/components/LoadingScreen';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const content = {
  title: 'Edit Game',
  buttonText: 'Update',
};

//Try implement with server action.
const EditGamePage = () => {
  const param = useParams();
  const {
    data: gameData,
    isLoading,
    isFetching,
  } = useGetSingleGameQuery(param?.gameId);

  if (isFetching || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <CreateGameForm content={content} gameData={gameData?.selectedGame} />
    </div>
  );
};

export default EditGamePage;
