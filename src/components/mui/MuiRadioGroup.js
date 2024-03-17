import React from 'react';

import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

const MuiRadioGroup = ({ values, defaultValue, name }) => {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={defaultValue}
              name="gameType"
              {...field}
            >
              <Stack direction={'row'}>
                {values?.length
                  ? values.map((value) => {
                      return (
                        <FormControlLabel
                          control={<Radio />}
                          label={value?.label}
                          value={value?.value}
                          key={value?.value}
                        />
                      );
                    })
                  : null}
              </Stack>
            </RadioGroup>
          );
        }}
      />
    </>
  );
};

export default MuiRadioGroup;
