export interface FinTypeAttributes {
  taxable: boolean;
  liquid: boolean;
}

export const FIN_INSTR_TYPES = new Map<string, FinTypeAttributes>([
  ['Cash', { taxable: false, liquid: true }],
  ['Stocks', { taxable: true, liquid: true }],
  ['Bonds', { taxable: true, liquid: true }],
  ['Real Estate', { taxable: true, liquid: false }],
  ['Mutual Funds', { taxable: true, liquid: true }],
  ['Retirement Account', { taxable: false, liquid: false }],
  ['Life Insurance', { taxable: false, liquid: false }],
  ['Debt / Loan', { taxable: false, liquid: true }],
]);
