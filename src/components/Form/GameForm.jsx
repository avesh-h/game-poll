"use client";

import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import MuiTextField from "../mui/MuiTextField";
import MuiDatePicker from "../mui/MuiDatePicker";
import MuiTimePicker from "../mui/MuiTimePicker";
import { useState } from "react";

const muiTextProps = {
  id: "outlined-basic",
  variant: "outlined",
  size: "small",
};

//Add validation zod

const GameForm = ({ content, ...props }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const methods = useForm({
    defaultValues: {
      gameName: "",
      noOfPlayers: "",
      gameType: "all",
      nameOfVenue: "",
      gameDate: "",
      startTime: "",
      endTime: "",
      gamePassword: "",
      totalCost: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log("ddd", { selectedDate, startTime, endTime });
    // console.log("Ddd", data);
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
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="all"
                  name="gameType"
                >
                  <Stack direction={"row"}>
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="All"
                    />
                    <FormControlLabel
                      value="team"
                      control={<Radio />}
                      label="Team"
                    />
                  </Stack>
                </RadioGroup>
                <Box>
                  <MuiTextField
                    {...muiTextProps}
                    label="Name of game"
                    name="gameName"
                    register={register}
                  />
                </Box>
                <Box>
                  <MuiTextField
                    {...muiTextProps}
                    label="No. of players"
                    name="noOfPlayers"
                    register={register}
                  />
                </Box>
                <Box>
                  <MuiTextField
                    {...muiTextProps}
                    label="Total cost"
                    name="totalCost"
                    register={register}
                  />
                </Box>
              </Stack>
              {/* Game Timing */}
              <Box>
                <FormLabel id="demo-radio-buttons-group-label">
                  Game Timing:
                </FormLabel>
                <MuiTextField
                  {...muiTextProps}
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
                  name={"gameDate"}
                  onChange={(value) => setSelectedDate(value)}
                />
              </Box>
              <Box>
                <MuiTimePicker
                  label={"Start time"}
                  name={"startTime"}
                  onChange={(value) => setStartTime(value)}
                />
              </Box>
              <Box>
                <MuiTimePicker
                  label={"End time"}
                  name={"endTime"}
                  onChange={(value) => setEndTime(value)}
                />
              </Box>
              <Box>
                <MuiTextField
                  {...muiTextProps}
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
