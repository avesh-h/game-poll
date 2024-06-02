'use client';

import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Button } from '@mui/material';

const buttonStyle = {
  width: '100%',
  justifyContent: 'flex-end',
  p: 2,
};

const ClipBoardButton = ({ copyText }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClipboard = () => {
    //Navigator browser API
    setIsCopied(true);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      {isCopied ? (
        <Button sx={buttonStyle}>
          <DoneAllIcon />
          Copied!
        </Button>
      ) : (
        <Button size="small" sx={buttonStyle} onClick={handleCopyClipboard}>
          <ContentCopyIcon />
          Copy
        </Button>
      )}
    </>
  );
};

export default ClipBoardButton;
