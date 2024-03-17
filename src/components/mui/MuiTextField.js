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

const muiTextProps = {
  id: 'outlined-basic',
  variant: 'outlined',
  size: 'small',
};

const MuiTextField = ({
  sx,
  value,
  type,
  inputProps,
  register,
  name,
  ...props
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <InputField
      sx={{ ...sx }}
      value={value}
      type={type}
      inputProps={{ ...register(name), ...inputProps }}
      error={errors[name] && errors[name]}
      helperText={errors[name] && errors[name]?.message}
      {...muiTextProps}
      {...props}
    />
  );
};

export default MuiTextField;
