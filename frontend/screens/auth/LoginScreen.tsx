import { UserContext } from "@/common/contexts/UserContext";
import LoginForm from "@/components/auth/LoginForm";
import { useContext } from "react";

export default function LoginScreen() {
  return (
    <main className="flex flex-col items-center justify-center">
      <LoginForm />
    </main>
  );
}
