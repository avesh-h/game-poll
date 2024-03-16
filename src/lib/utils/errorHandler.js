import { enqueueSnackbar } from "notistack";
export function errorHandler(errorObj, isToaster) {
  console.log("error", errorObj);
  //Set proper error message from the backend
  const error =
    errorObj?.data?.error?.message ||
    errorObj?.data?.message ||
    errorObj?.error?.data?.error ||
    errorObj?.error?.data?.message ||
    errorObj?.error ||
    errorObj?.message ||
    errorObj?.error?.error;

  console.log("errrorMsg", error);
  if (typeof error === "string") {
    enqueueSnackbar(error, { variant: "error" });
  }
  return error;
}
