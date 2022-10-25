import { OperatorType } from '../../../utils/constants';
import { SearchFilters } from '../../../models';
import { getQueryWithAndOperator, createComposedCountQuery, getQueryWithOrOperator } from './builders';

// The query building path depends on the high order condition
const createQueryWithAndOperator = (filters: SearchFilters) => ({
  data: getQueryWithAndOperator(filters),
  count: getQueryWithAndOperator(filters, true)
});

const createQueryWithOrOperator = (filters: SearchFilters) => ({
  data: getQueryWithOrOperator(filters),
  count: createComposedCountQuery(filters)
});

export const generateComposedQuery = (filters: SearchFilters): { data: string; count: string } =>
  filters.operator === OperatorType.OR ? createQueryWithOrOperator(filters) : createQueryWithAndOperator(filters);
