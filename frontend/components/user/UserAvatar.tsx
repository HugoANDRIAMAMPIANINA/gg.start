import { UserContext } from "@/common/contexts/UserContext";
import { useContext } from "react";

export default function UserAvatar() {
  const { currentUser, isLoading } = useContext(UserContext);

  if (isLoading || !currentUser) {
    return (
      <div className="avatar">
        <div className="w-36 rounded-full skeleton" />
      </div>
    );
  }

  const usernameInitial = currentUser.name[0];

  return (
    <div className="avatar avatar-placeholder">
      <div className="w-36 rounded-full bg-base-300">
        <span className="text-4xl text-base-content">{usernameInitial}</span>
      </div>
    </div>
  );
}
