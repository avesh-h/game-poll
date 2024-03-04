"use client";

import {
  Box,
  Button,
  Card,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import MuiTextField from "../mui/MuiTextField";
import { useSignupMutation } from "@/lib/actions/authActions";

const muiTextProps = {
  id: "outlined-basic",
  variant: "outlined",
  size: "small",
  type: "input",
};

//Add validation zod

const Signup = ({ content, login, onSubmit, ...props }) => {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = methods;

  const [signup, { isLoading }] = useSignupMutation();

  // const onSubmit = async (data, e) => {
  //   console.log("Ddd", data);
  //   const res = await signup(data);
  //   reset();
  // };

  return (
    <Stack direction={"row"} justifyContent={"center"} marginTop={5}>
      <Card
        sx={{
          width: "30%",
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
              {!login && (
                <Stack gap={3}>
                  <Box>
                    <MuiTextField
                      {...muiTextProps}
                      label="First name"
                      name="firstName"
                      register={register}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      {...muiTextProps}
                      label="Last name"
                      name="lastName"
                      register={register}
                    />
                  </Box>
                  <Box>
                    <MuiTextField
                      {...muiTextProps}
                      label="Phone"
                      name="phone"
                      register={register}
                    />
                  </Box>
                </Stack>
              )}
              <Box>
                <MuiTextField
                  {...muiTextProps}
                  label="Email"
                  name="email"
                  register={register}
                />
              </Box>
              <Box>
                <MuiTextField
                  {...muiTextProps}
                  label={login ? "Password" : "Set Password"}
                  name="password"
                  register={register}
                />
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

export default Signup;
