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
  Button,
  Card,
  RadioGroup, 
  Radio
} from "@nextui-org/react";
import { fetchTransactions } from "@/app/store/transactionSlice";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import AddTransactionModal from "./components/transactions/AddTransactionModal";

interface TransactionsProps {
  accounts: {
    id: string;
    accountNumber: string;
    accountType: string;
  }[];
}

const Transactions = ({ accounts }: TransactionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.transaction);
  const { userData } = useDashboard();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  /**
   * Calculate total number of pages needed for pagination
   * Math.ceil ensures we round up to include all items
   * Uses optional chaining (?.) and nullish coalescing (|| 0) for safety
   */
  const pages = Math.ceil((transactions?.length || 0) / rowsPerPage);

  /**
   * "Memoize" the current page's items to prevent unnecessary recalculations
   * Only updates when page number or transactions array changes
   * 
   * Calculation:
   * 1. start: Calculate starting index for current page ((page - 1) * rowsPerPage)
   * 2. end: Calculate ending index (start + rowsPerPage)
   * 3. slice: Extract only the items for current page
   * 4. || []: Fallback to empty array if transactions is undefined
   * 
   * @returns {Array} - Array of transactions for the current page
   */
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return transactions?.slice(start, end) || [];
  }, [page, transactions]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.id) {
        try {
          // console.log('Starting to fetch transactions for user:', userData.id);
          await dispatch(fetchTransactions(userData.id)).unwrap();
          // console.log('Successfully fetched transactions');
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      }
    };

    fetchData();
  }, [dispatch, userData?.id]);

  if (!userData?.id) {
    return <div>Loading user data...</div>;
  }

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error loading transactions: {error}</div>;
  }

  return (
    <Card className="my-3">
      <div>
        <div className="flex justify-between items-center p-3">
          <h1 className="font-mono p-2">Latest Transactions</h1>
          <Button
            color="primary"
            onPress={() => setIsModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accounts={accounts}
        />
        <Table
          className="p-2"
          removeWrapper
          color="primary"
          selectionMode="single"
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
            <TableColumn key="description">DESCRIPTION</TableColumn>
            <TableColumn key="type">TYPE</TableColumn>
            <TableColumn key="amount">AMOUNT</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent={"No transactions found"}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {`...${accounts.find(acc => acc.id === item.accountId)?.accountNumber.slice(-4) || 'N/A'}`}
                </TableCell>
                <TableCell>{item.description || 'No description'}</TableCell>
                <TableCell>{item.transactionType}</TableCell>
                <TableCell className={item.transactionType === 'deposit' ? 'text-green-700' : 'text-red-700'}>
                  {item.transactionType === 'deposit' ? '+' : '-'}
                  ${Math.abs(item.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default Transactions;