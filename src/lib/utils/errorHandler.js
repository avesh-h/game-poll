import { enqueueSnackbar } from 'notistack';
export function errorHandler(errorObj, isToaster) {
  //Set proper error message from the backend
  const error =
    errorObj?.data?.error?.message ||
    errorObj?.data?.message ||
    errorObj?.data?.error ||
    errorObj?.error?.data?.error ||
    errorObj?.error?.data?.message ||
    errorObj?.error ||
    errorObj?.message ||
    errorObj?.error?.error;

  if (typeof error === 'string') {
    enqueueSnackbar(error, { variant: 'error' });
  }
  return error;
}
