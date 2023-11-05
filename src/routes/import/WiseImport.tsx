import { Button, Container, Sheet, Stack, Table, Typography } from '@mui/joy';
import { useState } from 'react';
import { CreateTransactionDto, insertTransactions } from '../../api';
import { parse } from 'papaparse';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { format, parse as parseDate } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WiseTransaction {
  ID: string;
  Status: string;
  Direction: 'OUT' | 'IN' | 'NEUTRAL';
  'Created on': string; //'2023-11-04 19:58:05';
  'Finished on': string; //'2023-11-04 19:58:05';
  'Source fee amount': string; //'0.00';
  'Source fee currency': string;
  'Target fee amount': string;
  'Target fee currency': string;
  'Source name': string; //'Alexander Liam Nicholson';
  'Source amount': string;
  'Source currency': string; //'USD';
  'Target name': string; //"Trader Joe's";
  'Target amount (after fees)': string; //'10.48';
  'Target currency': string; //'USD';
  'Exchange rate': string; //'1.00000000';
  Reference: string; // '';
  Batch: string; //'';
}

const parseWiseCSV = (content: string): CreateTransactionDto[] => {
  const data = parse<WiseTransaction>(content.trim(), { header: true });

  const entries = data.data
    .filter((d) => d['Direction'] !== 'NEUTRAL')
    .map((d) => {
      const amount = Number(d['Target amount (after fees)']);

      return {
        date: parseDate(d['Created on'], 'yyyy-MM-dd HH:mm:ss', new Date()),
        amount: d['Direction'] === 'IN' ? amount : -amount,
        name: d['Target name'],
        source: 'Wise',
        sourceId: d.ID,
      };
    });

  // consolidate transactions with the same source ID
  const consolidatedTransactions = entries.reduce((acc, curr) => {
    const existing = acc.find((a) => a.sourceId === curr.sourceId);

    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push(curr);
    }

    return acc;
  }, [] as CreateTransactionDto[]);

  return consolidatedTransactions;
};

const WiseImport = () => {
  const [transactions, setTransactions] = useState<CreateTransactionDto[]>();
  const navigate = useNavigate();

  const onFileChange = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target?.result as string;
      setTransactions(parseWiseCSV(content));
    };

    reader.readAsText(file);
  };

  const handleContinue = async () => {
    if (!transactions) return;

    await insertTransactions(transactions);

    navigate('/');
  };

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Typography level={'h1'}>Import from Wise</Typography>
        <Sheet sx={{ p: 2 }}>
          <Stack direction={'row'}>
            <Stack sx={{ flexGrow: 1 }} direction={'row'}>
              <input
                accept='text/csv'
                style={{ display: 'none' }}
                id='raised-button-file'
                multiple
                type='file'
                onChange={onFileChange}
              />
              <label htmlFor='raised-button-file'>
                <Button component='span'>Choose CSV file</Button>
              </label>
            </Stack>
            <Button
              onClick={() => handleContinue()}
              disabled={!transactions}
              endDecorator={<ArrowRight />}
            >
              Continue
            </Button>
          </Stack>
        </Sheet>

        {transactions && (
          <Sheet sx={{ p: 2 }}>
            <Typography>{`Found ${transactions.length} transactions to import`}</Typography>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  console.log(t.date);
                  return (
                    <tr key={t.sourceId}>
                      <td>{format(t.date, 'dd/MM/yyyy')}</td>
                      <td>{t.name}</td>
                      <td>{formatCurrency(t.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Sheet>
        )}
      </Stack>
    </Container>
  );
};

export default WiseImport;
