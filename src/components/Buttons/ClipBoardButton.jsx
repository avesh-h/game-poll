'use client';

import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Button } from '@mui/material';

import { copyTextToClipboard } from '@/lib/utils/copyToClipboard';

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  justifyContent: 'flex-end',
};

const ClipBoardButton = ({ copyText, buttonText, buttonStyle, ...other }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClipboard = () => {
    //Navigator browser API
    setIsCopied(true);
    copyTextToClipboard(copyText);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      {isCopied ? (
        <Button sx={{ ...btnStyle, ...buttonStyle }} {...other}>
          <DoneAllIcon />
          Copied!
        </Button>
      ) : (
        <Button
          size="small"
          sx={{ ...btnStyle, ...buttonStyle }}
          onClick={handleCopyClipboard}
          {...other}
        >
          <ContentCopyIcon />
          {buttonText || 'Copy'}
        </Button>
      )}
    </>
  );
};

export default ClipBoardButton;
