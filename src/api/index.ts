import supabase from '../supabase/supabase.ts';

export interface CreateTransactionDto {
  date: Date;
  amount: number;
  name: string;
  source: string;
  sourceId?: string;
}

export const insertTransactions = async (data: CreateTransactionDto[]) => {
  await supabase.from('transactions').upsert(
    data.map((d) => ({
      date: d.date.toISOString(),
      amount: d.amount,
      name: d.name,
      source: d.source,
      source_id: d.sourceId,
      household: 1,
    })),
    {
      onConflict: 'source_id',
      ignoreDuplicates: true,
      count: 'exact',
    },
  );
};
