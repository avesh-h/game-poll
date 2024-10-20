'use client';

import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useRouter, useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import MuiDatePicker from '../mui/MuiDatePicker';
import MuiRadioGroup from '../mui/MuiRadioGroup';
import MuiSelect from '../mui/MuiSelect';
import MuiTextField from '../mui/MuiTextField';
import MuiTimePicker from '../mui/MuiTimePicker';
import MuiButton from '@/components/mui/MuiButton';
import { API_STATUS } from '@/constants/apiStatuses';
import {
  useCreateGameMutation,
  useUpdateGameMutation,
} from '@/lib/actions/gameActions';
import customDayjs from '@/lib/utils/customDayjs';
import { fnPressNumberKey } from '@/lib/utils/inputFunctions';
import { errorMessages } from '@/lib/utils/validationMessage';

const gameTypeValues = [
  { label: 'All', value: 'all' },
  { label: 'Team', value: 'team' },
];

const gamesOptions = ['Cricket', 'Football'];

//To make sure utc of indian time zone
dayjs.extend(utc);
dayjs.extend(timezone);

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
        customDayjs(gameData?.startTime).format('YYYY-MM-DD HH:mm:ss') ||
        customDayjs().format('YYYY-MM-DD HH:mm:ss'), //current time as default
      endTime:
        customDayjs(gameData?.endTime).format('YYYY-MM-DD HH:mm:ss') ||
        customDayjs().format('YYYY-MM-DD HH:mm:ss'),
      gameDate: customDayjs(gameData?.gameDate).format('YYYY-MM-DD') || '',
      gamePassword: gameData?.gamePassword || '',
      totalAmount: gameData?.totalAmount || '',
      note: gameData?.note || '',
    },
    resolver: yupResolver(gameSchema),
  });

  const { handleSubmit, register, reset, watch, setValue } = methods;

  const editGame = useParams();

  //Contants
  const selectedDate = watch('gameDate');
  const selectedStartTime = watch('startTime');

  //Create game api
  const [createGame, { isLoading }] = useCreateGameMutation();

  //Update game api
  const [updateGame, { isLoading: isUpdating }] = useUpdateGameMutation();

  //create member object
  const createMemberObject = (member, index, team, startIndex) => {
    const baseMember = {
      ...(member?.id
        ? {
            ...(member?.email ? { email: member.email } : {}),
            playerName: member.playerName,
            position: member.position,
            role: member.role,
            id: member.id,
            gameId: member.gameId,
          }
        : {}),
      playerIndex: team === 'teamB' ? startIndex : index,
    };

    // Only add `team` if it's not null
    if (team) {
      baseMember.team = team;
      baseMember.memberIndex = index;
    }

    return baseMember;
  };

  const onSubmit = async (data) => {
    if (data?.gameDate && data?.startTime && data?.endTime) {
      // UTC FOrmat
      const gameDate = customDayjs(data.gameDate).format('YYYY-MM-DD');

      // Construct start time and end time with the game date
      const startTimeLocal = dayjs(
        `${gameDate} ${customDayjs(data.startTime).format('HH:mm:ss')}`
      ).tz('Asia/Kolkata');
      const endTimeLocal = dayjs(
        `${gameDate} ${customDayjs(data.endTime).format('HH:mm:ss')}`
      ).tz('Asia/Kolkata');

      // Convert to UTC
      const startTimeUTC = startTimeLocal
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss[Z]');
      const endTimeUTC = endTimeLocal.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

      data.startTime = startTimeUTC;
      data.endTime = endTimeUTC;

      const dayJsStartTime = customDayjs(data.startTime);
      const dayJsEndTime = customDayjs(data.endTime);
      data.totalHours = dayJsEndTime.diff(dayJsStartTime, 'h', true);
    }
    //API
    let res;
    if (gameData) {
      data.gameId = gameData?._id;
      data.members = gameData?.members;
    }
    //Create empty objects for the members
    const members = [];
    let startIndex = 0;
    let startFromZero = false;
    for (let i = 0; i < data?.noOfPlayers; i++) {
      const isTeamB = i > Math.ceil(data?.noOfPlayers / 2) - 1;
      const team = isTeamB ? 'teamB' : 'teamA';

      if (data?.gameType === 'team') {
        if (isTeamB && !startFromZero) {
          startIndex = 0;
          startFromZero = true;
        } else if (isTeamB) {
          startIndex++;
        }
        members[i] = createMemberObject(
          data?.members?.[i],
          i,
          team,
          startIndex,
          'team'
        );
      } else {
        // Game type "all"
        members[i] = createMemberObject(
          data?.members?.[i],
          i,
          null,
          null,
          'all'
        );
      }
    }
    if (members?.length) {
      data.members = members;
      if (editGame?.gameId) {
        res = await updateGame(data);
        if (res?.data?.status === API_STATUS.success) {
          router.push(`/gamesList/${res?.data?.updatedGame?._id}`);
          enqueueSnackbar('Successfully Updated!', { variant: 'success' });
        }
      } else {
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
    if (selectedDate && customDayjs(selectedDate).isAfter(customDayjs())) {
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
    <Stack direction={'row'} justifyContent={'center'} my={4}>
      <Card
        sx={{
          width: '40%',
          minWidth: (theme) => ({
            minWidth: '300px',
            [theme.breakpoints.down('sm')]: { minWidth: '80%' },
          }),
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
                  <MuiSelect
                    title={'Name of game'}
                    options={gamesOptions}
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
                      customDayjs().format('YYYY-MM-DD HH:mm:ss')
                    );
                    setValue(
                      'endTime',
                      customDayjs().format('YYYY-MM-DD HH:mm:ss')
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
                  label="Add any note for the game..."
                  name="note"
                  register={register}
                  id="outlined-multiline-static"
                  multiline
                  rows={1.5}
                  sx={{ mt: 2 }}
                />
              </Box>
              <Box>
                <MuiTextField
                  label={'Set Password'}
                  name="gamePassword"
                  register={register}
                />
                <Typography sx={{ fontSize: '14px', color: 'red', pt: 1 }}>
                  Note: Your players access this game with password you set.
                </Typography>
              </Box>
              <Box>
                <MuiButton
                  type="submit"
                  variant={'contained'}
                  isLoading={isLoading || isUpdating}
                >
                  {content.buttonText}
                </MuiButton>
              </Box>
            </FormControl>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default CreateGameForm;
