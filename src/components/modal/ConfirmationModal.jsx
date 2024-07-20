'use client';

import { DialogContent, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import Image from 'next/image';

import ModalWrapper from './ModalWrapper';
import { Images } from '../../constants/images';
import MuiButton from '@/components/mui/MuiButton';

const ConfirmationModal = (props) => {
  const { open, loading, data, modelData } = props;
  const { showIcon = true, renderButtons = true } = data;

  return (
    <ModalWrapper
      // clearIcon={true}
      onClose={() => {
        data?.cancelButtonAction();
      }}
      isLoading={loading}
      open={open}
      sx={{ backgroundColor: '#fff', borderRadius: '15px' }}
    >
      <DialogContent sx={{ pb: 0, px: 8 }}>
        {showIcon && (
          <Box justifyContent="center" display={'flex'} mb={2}>
            {data?.icon ? (
              data?.icon
            ) : (
              <Image
                src={
                  data?.image ? data?.image : Images.exclationMarkIcon.filename
                }
                alt={data?.alt ? data?.alt : Images.exclationMarkIcon.alt}
              />
            )}
          </Box>
        )}

        <Stack textAlign={'center'}>
          <Typography variant="h4" mb={1}>
            {data?.title}
          </Typography>
          <Typography
            variant="subtitle2"
            color={(theme) => theme.palette.grey['dark']}
          >
            {data?.bodyText}
          </Typography>
        </Stack>
      </DialogContent>
      <Stack
        direction={'row'}
        justifyContent={'flex-end'}
        gap={2}
        sx={{ p: 3 }}
      >
        {renderButtons && (
          <>
            {data?.submitButtonAction ? (
              <MuiButton
                color={data?.submitButtonColor}
                title={data?.submitButtonTitle}
                variant={
                  data?.submitButtonVariant
                    ? data?.submitButtonVariant
                    : 'containedError'
                }
                onClick={() => data?.submitButtonAction(modelData)}
                isLoading={loading}
              />
            ) : null}

            <MuiButton
              title={data?.cancelButtonTitle}
              onClick={() => {
                if (data?.cancelButtonAction) {
                  data?.cancelButtonAction();
                }
              }}
              variant="outlined"
              color="inherit"
              disabled={loading}
            />
          </>
        )}
      </Stack>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
