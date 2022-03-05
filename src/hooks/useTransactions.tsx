import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string
}
//tres maneiras de se fazer
// interface TransactionInput {
//   title: string;
//   amount: number;
//   type: string;
//   category: string;
// }
//usar uma sintase do type script (ele vai herdar todos os campos)
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>; //vai omitir os camps setados
//type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>; //selecione os campo



//ReactNode aceita qualquer tipo de  conteudo valido pro react
interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (Transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);


export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(), //tem que salvar com data
    })
    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction,
    ]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );

}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}