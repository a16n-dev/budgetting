import { extendTheme } from '@mui/joy';

const theme = extendTheme({
  fontFamily: {
    display: '"Fira Sans", var(--joy-fontFamily-fallback)',
    body: '"Fira Sans", var(--joy-fontFamily-fallback)',
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          '50': '#FDEADD',
          '100': '#FAD2B4',
          '200': '#F8BB8F',
          '300': '#F6A76E',
          '400': '#F49550',
          '500': '#F28434',
          '600': '#CF5F0D',
          '700': '#A0490A',
          '800': '#693007',
          '900': '#2A1303',
          solidColor: 'var(--joy-palette-background-body)',
          solidDisabledColor: 'var(--joy-palette-background-body)',
        },
        // neutral: {
        //   '50': '#D5DEE3',
        //   '100': '#A0B4BF',
        //   '200': '#7693A3',
        //   '300': '#5B7786',
        //   '400': '#495F6C',
        //   '500': '#3A4C56',
        //   '600': '#2C3941',
        //   '700': '#212C32',
        //   '800': '#161D21',
        //   '900': '#090B0D',
        // },
        success: {
          '50': '#BBEC95',
          '100': '#A9E678',
          '200': '#97E15D',
          '300': '#88DD44',
          '400': '#7AD92E',
          '500': '#6ECA25',
          '600': '#53981C',
          '700': '#407515',
          '800': '#2A4D0E',
          '900': '#111F06',
        },
        danger: {
          '50': '#ECBEC9',
          '100': '#E4A0B0',
          '200': '#DC859A',
          '300': '#D46C85',
          '400': '#CE5672',
          '500': '#C84161',
          '600': '#9A2D47',
          '700': '#772236',
          '800': '#4E1724',
          '900': '#1F090E',
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {},
    },
    JoySheet: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
