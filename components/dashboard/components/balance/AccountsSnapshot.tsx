import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react'
import React from 'react'
import AccountPopover from '../shared/AccountPopover'
import { useBalance } from '../../hooks/useBalance'
import { useDashboard } from '../../hooks/useDashboard'

const AccountsSnapshot = () => {
  const { loading  } = useDashboard();
  const { accounts, formatCurrency } = useBalance();

  if (loading || !accounts) {
    return <Card shadow="sm" radius="sm" className="h-full flex flex-col">
      <CardBody>
        <p>Loading accounts...</p>
      </CardBody>
    </Card>
  }

  return (
    <Card shadow="sm" radius="sm" className="h-full flex flex-col">
      <CardHeader>
        <p className="text-tiny uppercase font-bold">Balances</p>
      </CardHeader>
      <CardBody className="overflow-visible p-3">
        <ul>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <li key={account.id}>
                <div>
                  <Card className="grid grid-cols-2" shadow="none" radius="none">
                    <div>
                      <span className="capitalize">
                        {account.accountType}{" "}
                        {account.accountNumber && (
                          <AccountPopover accountNumber={account.accountNumber} />
                        )}
                        {": "}$
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </Card>
                </div>
              </li>
            ))
          ) : (
            <li>No accounts found</li>
          )}
        </ul>
      </CardBody>
      <CardFooter className="text-small justify-between"></CardFooter>
    </Card>
  )
}

export default AccountsSnapshot