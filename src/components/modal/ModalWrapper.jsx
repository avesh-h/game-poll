'use client';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
export default function BasicModal({
  children,
  modalState,
  open = modalState.open,
  sx,
  modalStyle,
  style,
  handleClose,
  ...other
}) {
  return (
    <Box sx={sx} {...other}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ boxShadow: 'none', ...modalStyle }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // width: 'inherit',
            // height: 'inherit',
            bgcolor: 'background.paper',
            borderRadius: '15px',
            // border: '2px solid #000',
            // boxShadow: 0,
            // p: 4,
            ...style,
          }}
        >
          {children}
        </Box>
      </Modal>
    </Box>
  );
}
