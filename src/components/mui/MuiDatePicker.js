"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

const MuiDatePicker = ({ label, name, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <DatePicker
            format="DD/MM/YYYY"
            label={label}
            value={dayjs(field?.value)}
            onChange={(newValue) => {
              if (onChange) {
                onChange(newValue?.format("DD-MM-YYYY"));
              }
              field.onChange(newValue?.format("DD-MM-YYYY"));
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

export default MuiDatePicker;
