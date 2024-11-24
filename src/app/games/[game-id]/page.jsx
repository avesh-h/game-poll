'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import GameForm from '@/components/Form/GameForm';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';
import { connectToSocket, socket } from '@/lib/utils/socket';

const GameFormPage = () => {
  //For client side
  const params = useParams();
  const gameId = params?.['game-id'];
  const { data, isLoading } = useGetSingleGameQuery(gameId, {
    refetchOnMountOrArgChange: true,
  });
  const [gameDetails, setGameDetails] = useState(data?.selectedGame);

  useEffect(() => {
    if (!socket) {
      connectToSocket();
    }

    socket.emit('join_room', { gameId });

    //Get updated details of the players
    socket.on('updated_game_details', (data) => {
      setGameDetails(data?.gameDetails);
    });

    return () => {
      socket.emit('leave_room', { gameId });
      socket.off('updated_game_details');
    };
  }, [gameId]);

  // Just for filled the state.
  useEffect(() => {
    if (data?.selectedGame) {
      setGameDetails(data?.selectedGame);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <GameForm formData={gameDetails} />
    </div>
  );
};

export default GameFormPage;
