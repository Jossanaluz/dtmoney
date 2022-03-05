import { FormEvent, useState } from 'react';
import Modal from 'react-modal'


import incomeImg from '../../assets/income.svg'
import outcomeImg from '../../assets/outcome.svg'
import closeImg from '../../assets/close.svg'

import { Container, TransactionTypeContainer, RadioBox } from './styles';
import { useTransactions } from '../../hooks/useTransactions';


interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NewTransactionModal({ isOpen, onRequestClose }: NewTransactionModalProps) {
  const { createTransaction } = useTransactions();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('deposit');

  async function handleCreateNewTransaction(event: FormEvent) {
    event.preventDefault();


    await createTransaction({ //await verificar primeiro de a função esta certa para depois fechar o modal
      title,
      amount,
      category,
      type
    })
    setTitle(''); //resetar o valor dos campos
    setAmount(0);
    setCategory('');
    setType('deposit')
    onRequestClose(); //fechar o modal apos salvar
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button type='button'
        onClick={onRequestClose}
        className="react-modal-close"
      >
        <img src={closeImg} alt="icone de fechar" />
      </button>
      {/* o meu container é meu formulário que inseri o form no styles (styled.form) */}
      <Container onSubmit={handleCreateNewTransaction}>
        <h2>Cadastar Transação</h2>
        <input
          placeholder='Titulo'
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <input
          type="number"
          placeholder='Valor'
          value={amount}
          onChange={event => setAmount(Number(event.target.value))}
        />
        <TransactionTypeContainer>
          <RadioBox
            type="button"
            onClick={() => { setType('deposit'); }}
            isActive={type === 'deposit'}
            activeColor="green"
          >
            <img src={incomeImg} alt="icone de entrada" />
            <span>Entrada</span>
          </RadioBox>
          <RadioBox
            type="button"
            onClick={() => { setType('withdraw'); }}
            isActive={type === 'withdraw'}
            activeColor="red"
          >
            <img src={outcomeImg} alt="icone de saida" />
            <span>Saída</span>
          </RadioBox>
        </TransactionTypeContainer>

        <input
          placeholder='Categoria'
          value={category}
          onChange={event => setCategory(event.target.value)}
        />
        <button type="submit">
          Cadastrar
        </button>
      </Container>
    </Modal>
  );
}