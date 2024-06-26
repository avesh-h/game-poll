'use client';

import './loader.css';
import { styled } from '@mui/material';

const Main = styled('div')(() => ({
  zIndex: 99999,
  width: '100%',
  minHeight: 'calc(100vh - 70px)', // Assuming the navbar height is 70px, adjust as necessary
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Loader = () => {
  return (
    <Main>
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </Main>
  );
};

export default Loader;
