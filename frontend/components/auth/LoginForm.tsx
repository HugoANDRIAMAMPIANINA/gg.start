"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { getCurrentUser, login, LoginFormErrors } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Input } from "../ui/Input";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

export default function LoginForm() {
  const router = useRouter();

  const { setCurrentUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<LoginFormErrors | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result) {
      setErrors(result.errors);
      setPending(false);
      return;
    }

    const user = await getCurrentUser();
    setCurrentUser(user);
    router.push("/");
  }

  return (
    <div className="card shadow-sm mt-4 p-4 w-1/4">
      <form onSubmit={handleSubmit} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">gg.start</h1>
        <h2 className="card-title self-center">Content de vous revoir !</h2>

        <div className="flex flex-col gap-2">
          <FormField label="Email" error={errors?.email}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Mot de passe" error={errors?.password}>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        </div>

        <div className="card-actions justify-end">
          <Button width="full" disabled={pending} type="submit">
            Se connecter
          </Button>

          <Link className="link link-primary" href={"/auth/register/"}>
            Créer un nouveau compte
          </Link>
        </div>
      </form>
    </div>
  );
}
