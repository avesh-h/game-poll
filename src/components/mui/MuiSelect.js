'use client';

import { styled } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '8px',
  },
});

export default function MuiSelect({
  title,
  options,
  register,
  inputProps,
  name,
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{title}</InputLabel>
            <StyledSelect
              {...field}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              error={!!error}
              helperText={error?.message}
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: '12px',
                },
              }}
              label={title}
              inputProps={{ ...register(name), ...inputProps }}
            >
              {options?.length &&
                options?.map((option, i) => {
                  return (
                    <MenuItem key={`${option}-${i}`} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
            </StyledSelect>
          </FormControl>
        );
      }}
    />
  );
}
