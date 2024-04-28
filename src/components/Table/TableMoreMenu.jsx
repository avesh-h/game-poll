import { memo } from 'react';

import { MenuItem, Typography } from '@mui/material';

import MenuPopover from '../MenuPopover';

const TableMoreMenu = ({
  actions,
  open,
  onClose,
  setLoader,
  loader,
  menuPopoverWidth,
  isHide,
}) => {
  return (
    <>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disabledArrow={true}
        paperStyle={{
          'ml': 2.5,
          '& .MuiMenuItem-root': {
            'px': 1,
            'typography': 'body2',
            'borderRadius': 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions?.length &&
          // eslint-disable-next-line array-callback-return
          actions?.map((ele) => {
            if (!isHide) {
              return (
                <MenuItem
                  onClick={ele?.event}
                  sx={ele?.styling}
                  key={ele?.key}
                  disabled={ele?.disabled}
                >
                  <>
                    <Typography>{ele?.title}</Typography>
                  </>
                </MenuItem>
              );
            }
          })}
      </MenuPopover>
    </>
  );
};

export default memo(TableMoreMenu);
