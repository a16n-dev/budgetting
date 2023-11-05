import { Button, Container, Sheet, Stack, Table, Typography } from '@mui/joy';
import { format, parse as parseDate } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { parse } from 'papaparse';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateTransactionDto, insertTransactions } from '../../api';
import { formatCurrency } from '../../utils/formatCurrency.ts';

async function generateHash(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface WiseTransaction {
  ID: string;
  Status: string;
  Direction: 'OUT' | 'IN' | 'NEUTRAL';
  'Created on': string;
  'Finished on': string;
  'Source fee amount': string;
  'Source fee currency': string;
  'Target fee amount': string;
  'Target fee currency': string;
  'Source name': string;
  'Source amount': string;
  'Source currency': string;
  'Target name': string;
  'Target amount (after fees)': string;
  'Target currency': string;
  'Exchange rate': string;
  Reference: string;
  Batch: string;
}

const parseWiseCSV = async (
  content: string,
): Promise<CreateTransactionDto[]> => {
  const data = parse<WiseTransaction>(content.trim(), { header: true });

  const entries = await Promise.all(
    data.data
      .filter((d) => d['Direction'] !== 'NEUTRAL')
      .map(async (d) => {
        const amount = Number(d['Target amount (after fees)']);

        const id = await generateHash(JSON.stringify(d));

        return {
          date: parseDate(d['Created on'], 'yyyy-MM-dd HH:mm:ss', new Date()),
          amount: d['Direction'] === 'IN' ? amount : -amount,
          name: d['Target name'],
          source: 'Wise',
          sourceId: id,
        };
      }),
  );

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

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const csv = await parseWiseCSV(content);
      setTransactions(csv);
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
        <Typography level={'h1'}>{'Import from Wise'}</Typography>
        <Sheet sx={{ p: 2 }}>
          <Stack direction={'row'}>
            <Stack sx={{ flexGrow: 1 }} direction={'row'}>
              <input
                accept={'text/csv'}
                style={{ display: 'none' }}
                id={'raised-button-file'}
                multiple
                type={'file'}
                onChange={onFileChange}
              />
              <label htmlFor={'raised-button-file'}>
                <Button component={'span'}>{'Choose CSV file'}</Button>
              </label>
            </Stack>
            <Button
              onClick={() => handleContinue()}
              disabled={!transactions}
              endDecorator={<ArrowRight />}
            >
              {'Continue'}
            </Button>
          </Stack>
        </Sheet>

        {transactions && (
          <Sheet sx={{ p: 2 }}>
            <Typography>{`Found ${transactions.length} transactions to import`}</Typography>
            <Table>
              <thead>
                <tr>
                  <th>{'Date'}</th>
                  <th>{'Amount'}</th>
                  <th>{'Name'}</th>
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
