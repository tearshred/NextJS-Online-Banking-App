import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
  User,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { authService } from "@/app/services/authService";
import { useRouter } from "next/navigation";

export default function UserAvatar() {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout(dispatch);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger className="cursor-pointer">
          <div>
            <Badge content="new" color="primary" size="sm">
              <Avatar
                isBordered
                size="sm"
                src=""
                color="primary"
                radius="md"
                className="transition-transform"
              />
            </Badge>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem 
            key="profile" 
            className="h-14 gap-2"
            onClick={handleProfileClick}
          >
            <p>Signed in as</p>
            <p className="font-bold">@{userData?.username}</p>
          </DropdownItem>
          <DropdownItem key="settings">Profile</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="primary" onClick={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
