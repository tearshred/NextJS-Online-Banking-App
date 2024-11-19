'use client'

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { fetchTransactions } from "@/app/store/transactionSlice";

interface TransactionsProps {
  accounts: {
    id: string;
    accountNumber: string;
    // ... other account properties
  }[];
}

const Transactions = ({ accounts }: TransactionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading } = useSelector((state: RootState) => state.transaction);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTransactions(accounts.map(account => account.id).join(',')));
  }, [dispatch, accounts]);

  const pages = Math.ceil(transactions.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return transactions.slice(start, end);
  }, [page, transactions]);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div>
      <h1 className="font-mono p-2">Latest Transactions</h1>
      <Table
        aria-label="Transactions table with pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="date">DATE</TableColumn>
          <TableColumn key="account">ACCOUNT</TableColumn>
          <TableColumn key="type">TYPE</TableColumn>
          <TableColumn key="amount">AMOUNT</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {`...${accounts.find(acc => acc.id === item.accountId)?.accountNumber.slice(-4) || 'N/A'}`}
              </TableCell>
              <TableCell>{item.transactionType}</TableCell>
              <TableCell className={item.transactionType === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                ${Math.abs(item.amount).toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;