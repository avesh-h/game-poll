'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '8px',
  },
});

export default function MuiSelect({
  title,
  options,
  value,
  register,
  inputProps,
  name,
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={() => {
        return (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{title}</InputLabel>
            <StyledSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
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
