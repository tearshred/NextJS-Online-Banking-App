import {Popover, PopoverTrigger, PopoverContent, Button, Divider} from "@nextui-org/react";
import { useSelector } from 'react-redux';
import { selectRoutingNumber } from '@/app/store/accountSlice';

interface AccountPopoverProps {
  accountNumber: string;
}

export default function AccountPopover({ accountNumber }: AccountPopoverProps) {
  const routingNumber = useSelector(selectRoutingNumber);
  
  if (!accountNumber) return null;
  
  return (
    <Popover placement="top" showArrow={true} backdrop="blur">
      <PopoverTrigger>
        <Button 
          variant="light" 
          className="p-0 min-w-0 h-auto font-normal underline hover:text-primary cursor-pointer"
          title="Click to view full account number"
        >
          x{accountNumber.slice(-4)}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Account Details</div>
          <Divider className="my-2" />
          <div className="">Account Number: <span className="font-bold">{accountNumber}</span></div>
          <div className="">Routing Number: <span className="font-bold">{routingNumber}</span></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}