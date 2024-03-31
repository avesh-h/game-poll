import { memo } from 'react';

import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 99999,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function LoadingScreen({ ...other }) {
  return (
    <>
      <RootStyle {...other}>
        <CircularProgress color="primary" />
      </RootStyle>
    </>
  );
}

export default memo(LoadingScreen);
