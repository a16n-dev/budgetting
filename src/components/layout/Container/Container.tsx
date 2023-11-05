import { Box, BoxProps } from '@mui/joy';

const Container = ({ children, sx, ...rest }: BoxProps) => (
  <Box
    sx={{
      maxWidth: 600,
      mx: 'auto',
      px: 2,
      pt: 'max(env(safe-area-inset-top), 16px)',
      pb: 'max(env(safe-area-inset-bottom), 16px)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Box>
);

export default Container;
