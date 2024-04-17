'use client';

import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext } from 'react-hook-form';

const InputField = styled(TextField)({
  'width': '100%',
  '& .MuiInputBase-input': {
    padding: '10px',
  },
});

const MuiTextField = ({
  sx,
  type,
  inputProps,
  name,
  disabled,
  register,
  ...props
}) => {
  const { formState } = useFormContext();

  const errors = formState?.errors || {};

  return (
    <InputField
      sx={{ ...sx }}
      name={name}
      type={type}
      inputProps={{ ...register(name), ...inputProps }}
      error={errors[name] && errors[name]}
      helperText={errors[name] && errors[name]?.message}
      disabled={disabled}
      id="outlined-basic"
      variant="outlined"
      size="small"
      {...props}
    />
  );
};

export default MuiTextField;
