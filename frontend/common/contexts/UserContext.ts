import { createContext } from "react";
import { SessionUser } from "../interfaces/session-user.interface";

interface UserContextType {
  currentUser: SessionUser | null;
  setCurrentUser: (user: SessionUser | null) => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});
