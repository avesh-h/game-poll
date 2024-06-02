import { memo } from 'react';

import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')(() => ({
  zIndex: 99999,
  width: '100%',
  minHeight: 'calc(100vh - 70px)', // Assuming the navbar height is 70px, adjust as necessary
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}));

function LoadingScreen({ ...other }) {
  return (
    <RootStyle {...other}>
      <CircularProgress color="primary" />
    </RootStyle>
  );
}

export default memo(LoadingScreen);
