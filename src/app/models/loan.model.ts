export interface Loan {
  id: number;
  client: { cpf: string, name: string, lastName: string };
  amount: number;
  currency: string;
  loanDate: string;
  dueDate: string;
  interestRate: number; 
  totalAmount: number;
  exchangeRateToBRL: number;
  totalInBRL: number;
}
