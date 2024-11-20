import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Divider,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { useDashboard } from "./hooks/useDashboard";

export default function UserProfile() {
  const { userData, loading } = useDashboard();

  // Safety check - shouldn't normally hit this due to page wrapper
  if (loading || !userData) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="min-h-screen w-full shadow-lg">
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
            <InfoItem
              label="Email"
              value={userData.email}
              icon={
                userData.emailVerified ? (
                  <Image
                    src="/verified.svg"
                    alt="Verified Email"
                    width={16}
                    height={16}
                    className="inline-block ml-2"
                  />
                ) : (
                  <Image
                    src="/exclamation.svg"
                    alt="Unverified Email"
                    width={16}
                    height={16}
                    className="inline-block ml-2"
                  />
                )
              }
            />
            <InfoItem label="Username" value={userData.username} icon="" />
            <InfoItem
              label="Address"
              value={userData.address || "Not provided"}
              icon=""
            />
          </div>

          <Divider className="my-4" />
        </CardBody>
      </Card>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-small text-default-500">{label}</p>
      <p className="text-foreground font-medium">
        {value}
        {icon}
      </p>
    </div>
  );
}
