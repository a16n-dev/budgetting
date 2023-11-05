import { Sheet, Stack, Typography } from '@mui/joy';
import Container from '../components/layout/Container/Container';

const Categorise = () => {
  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Typography level={'h1'}>Categorise</Typography>
        <Sheet sx={{ p: 2 }} variant={'outlined'}></Sheet>
      </Stack>
    </Container>
  );
};

export default Categorise;
