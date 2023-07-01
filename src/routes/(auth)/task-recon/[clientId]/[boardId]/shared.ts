import { z } from 'zod';

export const filterOptions = z.enum(['untracked', 'all', 'invoiced']);
export type FilterOptions = z.infer<typeof filterOptions>;
