"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { getCurrentUser, login, LoginFormErrors } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

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
    <div className="card shadow-sm lg:w-md">
      <form onSubmit={handleSubmit} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">gg.start</h1>
        <h2 className="card-title self-center">Content de vous revoir !</h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input input-primary w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors?.email && <p className="text-error">{errors.email}</p>}

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input input-primary w-full"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors?.password && (
            <div>
              <p>Password must:</p>
              <ul>
                {errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
          {errors?.message && <p className="text-error">{errors.message}</p>}
        </div>

        <div className="card-actions justify-end">
          <button
            disabled={pending}
            type="submit"
            className="btn btn-primary w-full"
          >
            Se connecter
          </button>

          <Link className="link link-primary" href={"/auth/register/"}>
            Créer un nouveau compte
          </Link>
        </div>
      </form>
    </div>
  );
}
