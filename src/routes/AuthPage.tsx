import { Sheet, Stack } from '@mui/joy';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Container from '../components/layout/Container/Container.tsx';
import supabase from '../supabase/supabase.ts';

export const authSessionContext = createContext<Session | null>(null);

const AuthPage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Container>
        <Stack>
          <Sheet sx={{ p: 2 }}>
            <Auth
              socialLayout={'horizontal'}
              supabaseClient={supabase}
              // theme={'dark'}
              appearance={{
                theme: ThemeSupa,
              }}
            />
          </Sheet>
        </Stack>
      </Container>
    );
  } else {
    return (
      <authSessionContext.Provider value={session}>
        <Outlet />
      </authSessionContext.Provider>
    );
  }
};

export default AuthPage;
