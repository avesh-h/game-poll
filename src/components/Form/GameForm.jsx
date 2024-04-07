'use client';

import { FormLabel, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import PlayerForm from './PlayerForm';

const playingPositions = [
  'ST',
  'GK',
  'LW',
  'RW',
  'CAM',
  'CDM',
  'CM',
  'RM',
  'LM',
  'CB',
  'RB',
  'LB',
];

const GameForm = ({ formData }) => {
  const methods = useForm({
    playerName: '',
    position: '',
  });
  const { handleSubmit, register, reset } = methods;

  const handleChange = () => {};

  const getAllPlayers = useCallback(() => {
    const addedPlayers = [];
    for (let i = 0; i < formData?.noOfPlayers; i++) {
      if (
        formData?.members?.[i] &&
        Object.values(formData?.members?.[i])?.length
      ) {
        addedPlayers.push(formData?.members[i]);
      } else {
        addedPlayers.push({});
      }
    }
    return addedPlayers;
  }, [formData]);

  //Member form submission
  const onSubmit = useCallback((memberData) => {
    console.log('member', memberData);
  }, []);

  return (
    <Stack alignItems={'center'}>
      <FormLabel id="demo-radio-buttons-group-label">
        Select Your Seat:
      </FormLabel>
      {formData &&
        getAllPlayers()?.map((player, ind) => {
          console.log('player', player);
          return (
            <PlayerForm
              player={player}
              ind={ind}
              key={`${player?.name}-${ind}`}
            />
          );
        })}
    </Stack>
  );
};

export default GameForm;
