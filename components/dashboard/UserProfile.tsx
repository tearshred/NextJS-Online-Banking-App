import { Card, CardHeader, CardBody, Avatar, Divider, Spinner } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export default function UserProfile() {
  const { userData, loading } = useSelector((state: RootState) => state.auth);
  
  // Safety check - shouldn't normally hit this due to page wrapper
  if (!userData) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="flex gap-5 p-6">
          <Avatar
            isBordered
            radius="full"
            size="lg"
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`}
            color="primary"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">
              {`${userData.firstName} ${userData.lastName}`}
            </h1>
            <p className="text-small text-default-500">@{userData.username}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Email" value={userData.email} />
            <InfoItem label="Username" value={userData.username} />
            <InfoItem 
              label="Address" 
              value={userData.address || "Not provided"} 
            />
          </div>
          
          <Divider className="my-4" />
          
        </CardBody>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-small text-default-500">{label}</p>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  );
} 