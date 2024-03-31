'use client';

import { Button } from '@mui/material';

const MuiButton = ({ title, ...others }) => {
  return <Button {...others}>{title}</Button>;
};

export default MuiButton;
