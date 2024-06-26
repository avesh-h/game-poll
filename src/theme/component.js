export const components = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        // '&:hover .MuiOutlinedInput-notchedOutline': {
        //   borderColor: 'green', // Change border color on hover
        // },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#272727', // Change border color when focused
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#272727', // Default border color
          //   backgroundColor: '',
          //   color: '#fff',
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        // color: '#272727', // Default label color
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: '0px 2px 10px 0 #d4d4d4',
      },
    },
  },
};
