'use client';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

const MuiTimePicker = ({ label, name, onChange, ...props }) => {
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
                onChange(dayjs(newValue).format('YYYY-MM-DD HH:mm:ss'));
              }
              field.onChange(dayjs(newValue).format('YYYY-MM-DD HH:mm:ss'));
            }}
            slotProps={{
              textField: {
                helperText: error?.message || error?.type,
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
