'use client';

import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import MuiDatePicker from '../mui/MuiDatePicker';
import MuiRadioGroup from '../mui/MuiRadioGroup';
import MuiTextField from '../mui/MuiTextField';
import MuiTimePicker from '../mui/MuiTimePicker';
import { API_STATUS } from '@/constants/apiStatuses';
import {
  useCreateGameMutation,
  useUpdateGameMutation,
} from '@/lib/actions/gameActions';
import { fnPressNumberKey } from '@/lib/utils/inputFunctions';
import { errorMessages } from '@/lib/utils/validationMessage';

const gameTypeValues = [
  { label: 'All', value: 'all' },
  { label: 'Team', value: 'team' },
];

const CreateGameForm = ({ content, gameData }) => {
  const router = useRouter();

  //Validation
  const gameSchema = Yup.object().shape({
    gameName: Yup.string()
      .required(errorMessages.REQUIRED)
      .min(3, errorMessages.TOO_SHORT)
      .max(12, errorMessages.TOO_LONG),
    noOfPlayers: Yup.string().required(errorMessages.REQUIRED),
    gameType: Yup.string().required(errorMessages.REQUIRED),
    nameOfVenue: Yup.string().required(errorMessages.REQUIRED),
    gameDate: Yup.string().required(errorMessages.REQUIRED),
    startTime: Yup.date().required(errorMessages.REQUIRED),
    endTime: Yup.date().required(errorMessages.REQUIRED),
    gamePassword: Yup.string()
      .required(errorMessages.REQUIRED)
      .min(4, errorMessages.TOO_SHORT)
      .max(15, errorMessages.TOO_LONG),
    totalAmount: Yup.string().required(errorMessages.REQUIRED),
  });

  const methods = useForm({
    defaultValues: {
      gameName: gameData?.gameName || '',
      noOfPlayers: gameData?.noOfPlayers || '',
      gameType: gameData?.gameType || 'all',
      nameOfVenue: gameData?.nameOfVenue || '',
      startTime:
        dayjs(gameData?.startTime).format('YYYY-MM-DD HH:mm:ss') ||
        dayjs().format('YYYY-MM-DD HH:mm:ss'), //current time as default
      endTime:
        dayjs(gameData?.endTime).format('YYYY-MM-DD HH:mm:ss') ||
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
      gameDate: dayjs(gameData?.gameDate).format('YYYY-MM-DD') || '',
      gamePassword: gameData?.gamePassword || '',
      totalAmount: gameData?.totalAmount || '',
    },
    resolver: yupResolver(gameSchema),
  });

  const { handleSubmit, register, reset, watch, setValue } = methods;

  //Contants
  const selectedDate = watch('gameDate');
  const selectedStartTime = watch('startTime');

  //Create game api
  const [createGame, { isLoading }] = useCreateGameMutation();

  //Update game api
  const [updateGame, { isLoading: isUpdating }] = useUpdateGameMutation();

  const onSubmit = async (data) => {
    if (data?.gameDate && data?.startTime && data?.endTime) {
      data.startTime = dayjs(data.startTime).format('YYYY-MM-DD HH:mm:ss');
      data.endTime = dayjs(data.endTime).format('YYYY-MM-DD HH:mm:ss');
      const dayJsStartTime = dayjs(data.startTime);
      const dayJsEndTime = dayjs(data.endTime);
      data.totalHours = dayJsEndTime.diff(dayJsStartTime, 'h', true);
    }
    //API
    let res;
    if (gameData) {
      data.gameId = gameData?._id;
      res = await updateGame(data);
      if (res?.data?.status === API_STATUS.success) {
        enqueueSnackbar('Successfully Updated!', { variant: 'success' });
      }
    } else {
      //Create empty objects for the members
      const members = [];
      let startIndex = 0;
      let startFromZero = false;
      for (let i = 0; i < data?.noOfPlayers; i++) {
        if (data?.gameType === 'team') {
          //Gametype = "team"
          if (i > Math.ceil(data?.noOfPlayers / 2) - 1) {
            if (!startFromZero) {
              startIndex = 0;
              members[i] = {
                playerIndex: startIndex,
                team: 'teamB',
                memberIndex: i,
              };
              startFromZero = true;
            } else {
              startIndex++;
              members[i] = {
                playerIndex: startIndex,
                team: 'teamB',
                memberIndex: i,
              };
            }
          } else {
            members[i] = { playerIndex: i, team: 'teamA', memberIndex: i };
          }
        } else {
          //Gametype = "all"
          members[i] = { playerIndex: i };
        }
      }
      data.members = members;
      if (data?.members?.length) {
        res = await createGame(data);
        if (res?.data?.message) {
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
          reset();
          router.push(`/games/${res?.data?.createdGame?._id}`);
        }
      }
    }
  };

  //Disable all past time
  const disableTime = () => {
    if (selectedDate && dayjs(selectedDate).isAfter(dayjs())) {
      return false;
    }
    return true;
  };

  //End time cannot before start time
  const disableEndTimebeforeStartTime = useCallback(
    (date) => {
      if (date.isBefore(selectedStartTime)) {
        return true;
      }
      return false;
    },
    [selectedStartTime]
  );

  return (
    <>
      {gameData ? (
        <Stack direction={'row'} justifyContent={'center'}>
          <Button>Copy Game Details</Button>
          <Button>Share</Button>
        </Stack>
      ) : null}
      <Stack direction={'row'} justifyContent={'center'} marginTop={5}>
        <Card
          sx={{
            width: '40%',
            minWidth: '280px',
            p: 2,
          }}
        >
          <Typography variant="h5" textAlign={'center'} paddingBottom={3}>
            {content.title}
          </Typography>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ gap: 3 }}>
                <Stack gap={3}>
                  <MuiRadioGroup
                    defaultValue={'all'}
                    name={'gameType'}
                    values={gameTypeValues}
                  />
                  <Box>
                    <MuiTextField
                      label="Name of game"
                      name="gameName"
                      register={register}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      label="No. of players"
                      name="noOfPlayers"
                      register={register}
                      onKeyPress={fnPressNumberKey}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      label="Total cost"
                      name="totalAmount"
                      register={register}
                      onKeyPress={fnPressNumberKey}
                    />
                  </Box>
                </Stack>
                {/* Game Timing */}
                <Box>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Game Timing:
                  </FormLabel>
                  <MuiTextField
                    label="Game Venue"
                    name="nameOfVenue"
                    register={register}
                    id="outlined-multiline-static"
                    multiline
                    rows={1.5}
                    sx={{ mt: 2 }}
                  />
                </Box>
                <Box>
                  <MuiDatePicker
                    label={'Select Date'}
                    name="gameDate"
                    onChange={() => {
                      setValue(
                        'startTime',
                        dayjs().format('YYYY-MM-DD HH:mm:ss')
                      );
                      setValue(
                        'endTime',
                        dayjs().format('YYYY-MM-DD HH:mm:ss')
                      );
                    }}
                    disablePast={disableTime()}
                  />
                </Box>
                <Box>
                  <MuiTimePicker
                    label={'Start time'}
                    name="startTime"
                    disabled={!selectedDate}
                    disablePast={disableTime()}
                  />
                </Box>
                <Box>
                  <MuiTimePicker
                    label={'End time'}
                    name="endTime"
                    disabled={!selectedDate}
                    shouldDisableTime={disableEndTimebeforeStartTime}
                    disablePast={disableTime()}
                  />
                </Box>
                <Box>
                  <MuiTextField
                    label={'Set Password'}
                    name="gamePassword"
                    register={register}
                  />
                  <Typography sx={{ fontSize: '12px', pt: 1 }}>
                    Note: The form is only accessible with the password you set.
                  </Typography>
                </Box>
                <Box>
                  <Button type="submit" disabled={isLoading || isUpdating}>
                    {content.buttonText}
                  </Button>
                </Box>
              </FormControl>
            </form>
          </FormProvider>
        </Card>
      </Stack>
    </>
  );
};

export default CreateGameForm;
