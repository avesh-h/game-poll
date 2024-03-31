import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material';

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '10px',
  },
});

export default function MuiSelect({ title, options, value }) {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    console.log(event.target.value);
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{title}</InputLabel>
      <StyledSelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={handleChange}
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
}
