import { Session } from '@supabase/supabase-js';
import { useContext } from 'react';

import { authSessionContext } from '../routes/AuthPage.tsx';

const useAuthSession = () => useContext(authSessionContext) as Session;

export default useAuthSession;
