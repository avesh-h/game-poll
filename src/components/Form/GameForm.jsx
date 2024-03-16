"use client";

import { useCreateGameMutation } from "@/lib/actions/gameActions";
import { fnPressNumberKey } from "@/lib/utils/inputFunctions";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import MuiDatePicker from "../mui/MuiDatePicker";
import MuiRadioGroup from "../mui/MuiRadioGroup";
import MuiTextField from "../mui/MuiTextField";
import MuiTimePicker from "../mui/MuiTimePicker";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessages } from "@/lib/utils/validationMessage";
import { enqueueSnackbar } from "notistack";

const gameTypeValues = [
  { label: "All", value: "all" },
  { label: "Team", value: "team" },
];

//Add validation zod

const GameForm = ({ content, ...props }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  //Create game api
  const [createGame, { isLoading, isSuccess }] = useCreateGameMutation();

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
      gameName: "",
      noOfPlayers: "",
      gameType: "all",
      nameOfVenue: "",
      gameDate: dayjs().format("YYYY-MM-DD HH:mm:ss"), //current date as default
      startTime: dayjs().format("YYYY-MM-DD HH:mm:ss"), //current time as default
      endTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      gamePassword: "",
      totalAmount: "",
    },
    resolver: yupResolver(gameSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = methods;

  const onSubmit = async (data) => {
    if (startTime && endTime) {
      const dayJsStartTime = dayjs(startTime);
      const dayJsEndTime = dayjs(endTime);
      //Format for time
      data.startTime = startTime;
      data.endTime = endTime;
      data.totalHours = dayJsEndTime.diff(dayJsStartTime, "h", true);
    }
    if (selectedDate) {
      //Format for date
      data.gameDate = selectedDate;
    }
    //API
    const res = await createGame(data);
    if (isSuccess) {
      enqueueSnackbar(res?.data?.message, { variant: "success" });
    }
    reset();
  };

  return (
    <Stack direction={"row"} justifyContent={"center"} marginTop={5}>
      <Card
        sx={{
          width: "40%",
          minWidth: "250px",
          p: 2,
        }}
      >
        <Typography variant="h5" textAlign={"center"} paddingBottom={3}>
          {content.title}
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ gap: 3 }}>
              <Stack gap={3}>
                <FormLabel id="demo-radio-buttons-group-label">
                  Game Type:
                </FormLabel>
                <MuiRadioGroup
                  defaultValue={"all"}
                  name={"gameType"}
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
                  label={"Select Date"}
                  name="gameDate"
                  onChange={(value) => setSelectedDate(value)}
                />
              </Box>
              <Box>
                <MuiTimePicker
                  label={"Start time"}
                  name="startTime"
                  onChange={(value) => setStartTime(value)}
                />
              </Box>
              <Box>
                <MuiTimePicker
                  label={"End time"}
                  name="endTime"
                  onChange={(value) => setEndTime(value)}
                />
              </Box>
              <Box>
                <MuiTextField
                  label={"Set Password"}
                  name="gamePassword"
                  register={register}
                />
                <Typography sx={{ fontSize: "12px", pt: 1 }}>
                  Note: The form is only accessible with the password you set.
                </Typography>
              </Box>
              <Box>
                <Button type="submit">{content.buttonText}</Button>
              </Box>
            </FormControl>
          </form>
        </FormProvider>
      </Card>
    </Stack>
  );
};

export default GameForm;
