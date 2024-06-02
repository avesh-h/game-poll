import { useCallback } from 'react';

import { Tooltip, Typography } from '@mui/material';

const ElementsTooltip = ({
  upperElement,
  lowerElement,
  maxLengthOfUpperElement,
  maxLengthOfLowerElement,
  placement,
  variant,
}) => {
  const customerDataStyling = useCallback((bool, data) => {
    switch (data) {
      case 'upperElement':
      case 'lowerElement':
        return {
          maxWidth: '16rem',
          overflow: bool ? 'hidden' : '',
          textOverflow: bool ? 'ellipsis' : '',
          whiteSpace: 'nowrap',
        };

      default:
        return;
    }
  }, []);

  return (
    <>
      <Tooltip
        disableHoverListener={upperElement?.length <= maxLengthOfUpperElement}
        title={upperElement}
        arrow
        placement={placement ? placement : 'top'}
      >
        <Typography
          sx={{
            ...customerDataStyling(
              upperElement?.length > maxLengthOfUpperElement,
              'upperElement'
            ),
          }}
          variant={variant ? variant : 'body2'}
        >
          {upperElement || 'N/A'}
        </Typography>
      </Tooltip>

      {lowerElement ? (
        <Tooltip
          disableHoverListener={lowerElement?.length <= maxLengthOfLowerElement}
          title={lowerElement}
          arrow
          placement="bottom"
        >
          <Typography
            variant="body2"
            sx={{
              ...customerDataStyling(
                lowerElement?.length > maxLengthOfLowerElement,
                'lowerElement'
              ),
            }}
            color={(theme) => theme.palette.grey[500]}
          >
            {lowerElement || 'N/A'}
          </Typography>
        </Tooltip>
      ) : null}
    </>
  );
};

export default ElementsTooltip;
