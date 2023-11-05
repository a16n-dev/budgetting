import { Button, Sheet, Stack, Typography } from '@mui/joy';
import { useQuery } from 'react-query';

import Container from '../../components/layout/Container/Container.tsx';
import { RouterLink } from '../../components/layout/RouterLink/RouterLink.tsx';
import supabase from '../../supabase/supabase.ts';

const Home = () => {
  const { data } = useQuery(
    'transactions',
    async () =>
      // .is('category', null)
      await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .is('category', null),
  );

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Typography level={'h1'} color={'primary'}>
          {'Spensee'}
        </Typography>
        <Sheet sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography level={'h3'}>{'Import Transactions'}</Typography>
            <Button component={RouterLink} to={'/import/wise'}>
              {'Import from Wise'}
            </Button>
          </Stack>
        </Sheet>
        <Sheet sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography level={'h3'}>{'Categorise'}</Typography>
            {data?.count ? (
              <Button
                component={RouterLink}
                to={'/categorise'}
                variant={'outlined'}
              >{`Categorise ${data?.count} transactions`}</Button>
            ) : (
              <Typography>{'🎉 All caught up!'}</Typography>
            )}
          </Stack>
        </Sheet>
      </Stack>
    </Container>
  );
};

export default Home;
