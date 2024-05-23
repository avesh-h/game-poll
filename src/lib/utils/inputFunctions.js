export const fnPressNumberKey = (e) => {
  if (
    (e.charCode !== 46 || e.target.value.includes('.')) &&
    !(e.charCode >= 48 && e.charCode <= 57)
  ) {
    e.stopPropagation();
    e.preventDefault();
  }
};
