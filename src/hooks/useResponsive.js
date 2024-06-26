import { useTheme, useMediaQuery } from '@mui/system';

export const useResponsive = (query, key) => {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key));

  if (query === 'up') {
    return mediaUp;
  } else if (query === 'down') {
    return mediaDown;
  }
  return null;
};
