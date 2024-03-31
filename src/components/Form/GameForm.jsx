'use client';

import EditIcon from '@mui/icons-material/Edit';
import { Button, FormLabel, Grid, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MuiSelect from '../mui/MuiSelect';
import MuiTextField from '../mui/MuiTextField';

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
  const methods = useForm();
  console.log('data', formData);
  const { handleSubmit, register, reset } = methods;

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
    console.log('added', addedPlayers);
    return addedPlayers;
  }, [formData]);

  return (
    <Stack alignItems={'center'}>
      <FormProvider {...methods}>
        <form style={{ width: '80%' }}>
          <FormLabel id="demo-radio-buttons-group-label">
            Select Your Seat:
          </FormLabel>
          {formData &&
            getAllPlayers()?.length &&
            getAllPlayers().map((player, ind) => {
              return (
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography pr={2}>{ind + 1}</Typography>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={4}>
                      <MuiTextField
                        label="Enter your name"
                        name="playerName"
                        register={register}
                        value={player?.name || ''}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <MuiSelect
                        title={'Position'}
                        options={playingPositions}
                        name={'position'}
                        value={player?.position || ''}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button type="submit">Submit</Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button>
                        <EditIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>
              );
            })}
        </form>
      </FormProvider>
    </Stack>
  );
};

export default GameForm;
