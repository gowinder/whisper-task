import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: 10,
  palette: {
    mode: 'light',
    primary: {
      main: '#1abc9c',
      200: '#6fd0b8',
      100: '#aae2d4',
    },
    secondary: {
      main: '#a3516e',
    },
  },
  shape: {
    borderRadius: 15,
  },
});

export default theme;