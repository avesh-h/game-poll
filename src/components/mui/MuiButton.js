'use client';

import { Button, CircularProgress, Typography } from '@mui/material';

const MuiButton = ({
  isLoading,
  title,
  onClick,
  customStyle,
  color,
  size,
  variant,
  disabled = false,
  changeVariantTo,
  noDisableStyle = false,
  children,
  ...other
}) => {
  return (
    <Button
      size={size ? size : 'large'}
      sx={{
        ...customStyle,
        ':disabled': {
          opacity: noDisableStyle ? 1 : 0.6,
          //   backgroundColor: (theme) =>
          //     !noDisableStyle && variant !== 'text' && theme.palette.grey[300],
        },
      }}
      disabled={isLoading || disabled}
      onClick={onClick}
      variant={variant}
      color={color}
      {...other}
    >
      <Typography
        color="inherit"
        variant={changeVariantTo ? changeVariantTo : 'button'}
      >
        {children || title}
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ ml: 1 }} size={15} color="inherit" />
      ) : null}
    </Button>
  );
};

export default MuiButton;
