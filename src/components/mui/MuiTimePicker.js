"use client";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

const MuiTimePicker = ({ label, name, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <TimePicker
            label={label}
            value={dayjs(field?.value)}
            onChange={(newValue) => {
              if (onChange) {
                onChange(newValue);
              }
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                helperText: error?.type || error?.message,
                error: Boolean(error),
              },
            }}
            {...props}
          />
        );
      }}
    />
  );
};

export default MuiTimePicker;
