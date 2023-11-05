import { CssBaseline, CssVarsProvider, GlobalStyles } from '@mui/joy';
import { QueryClient, QueryClientProvider } from 'react-query';

import AuthPage from './AuthPage.tsx';

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '& .lucide': {
              color: 'var(--Icon-color)',
              margin: 'var(--Icon-margin)',
              fontSize: 'var(--Icon-fontSize, 20px)',
              width: '1em',
              height: '1em',
            },
          }}
        />
        <AuthPage />
      </CssVarsProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
