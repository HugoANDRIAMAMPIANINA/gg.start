"use client";

"use client";

import { useActionState, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/common/contexts/UserContext";
import { updateProfile, UpdateProfileResult } from "@/lib/actions/auth";
import UserAvatar from "@/components/user/UserAvatar";

export default function MeProfileScreen() {
  const router = useRouter();
  const { currentUser, setCurrentUser, isLoading } = useContext(UserContext);
  const [state, action, pending] = useActionState<UpdateProfileResult | undefined, FormData>(
    (_state, formData) => updateProfile(formData),
    undefined,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordEditEnabled, setIsPasswordEditEnabled] = useState(false);

  const hasPasswordAttempt = Boolean(isPasswordEditEnabled && (password || confirmPassword));

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, isLoading, router]);

  const openEditModal = () => {
    if (!currentUser) {
      return;
    }

    setName(currentUser.username);
    setEmail(currentUser.email);
    setPassword("");
    setConfirmPassword("");
    setIsPasswordEditEnabled(false);
    setSuccessMessage("");
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (state?.message && !state?.errors) {
      setSuccessMessage(state.message);
    }

    if (state?.errors) {
      setSuccessMessage("");
    }

    if (state?.user && currentUser) {
      const updatedUsername = state.user.name ?? currentUser.username;
      const updatedEmail = state.user.email ?? currentUser.email;

      if (
        updatedUsername !== currentUser.username ||
        updatedEmail !== currentUser.email
      ) {
        setCurrentUser({
          ...currentUser,
          username: updatedUsername,
          email: updatedEmail,
        });
      }
    }
  }, [state, currentUser, setCurrentUser]);

  useEffect(() => {
    if (!password) {
      setConfirmPassword("");
    }
  }, [password]);

  if (!currentUser && isLoading) {
    return (
      <main>
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 rounded-full bg-base-200" />
          <div className="h-8 w-40 rounded bg-base-200" />
          <div className="h-60 rounded-lg bg-base-200" />
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-base-200 bg-base-100 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar />
            <div>
              <p className="text-sm text-muted-foreground">Profil</p>
              <h2 className="text-3xl font-semibold">{currentUser.username}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openEditModal}
          >
            Modifier mes informations personnelles
          </button>
        </div>
      </section>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 px-6 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Modifier le profil</p>
                <h4 className="text-xl font-semibold">Informations personnelles</h4>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditModalOpen(false)}
              >
                Fermer
              </button>
            </div>

            <form action={action} className="space-y-6 px-6 py-6">
              {successMessage && (
                <div className="rounded border border-green-300 bg-green-100 p-4 text-green-800">
                  {successMessage}
                </div>
              )}

              <div className="grid gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="label">
                    Nom
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Nom"
                    className="input input-primary w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {state?.errors?.name && (
                    <p className="text-error">{state.errors.name}</p>
                  )}
                </div>

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
                  {state?.errors?.email && (
                    <p className="text-error">{state.errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isPasswordEditEnabled}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        setIsPasswordEditEnabled(enabled);
                        if (!enabled) {
                          setPassword("");
                          setConfirmPassword("");
                        }
                      }}
                    />
                    <span>Modifier le mot de passe</span>
                  </label>
                </div>

                {isPasswordEditEnabled && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="password" className="label">
                        Nouveau mot de passe
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="input input-primary w-full"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="confirmPassword" className="label">
                        Confirmer le mot de passe
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="input input-primary w-full"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {state?.errors?.password && hasPasswordAttempt && (
                  <div>
                    <p>Le mot de passe doit :</p>
                    <ul>
                      {state.errors.password.map((error) => (
                        <li key={error} className="text-error">
                          - {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {state?.errors?.message && (
                  <p className="text-error">{state.errors.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  disabled={pending}
                  type="submit"
                  className="btn btn-primary"
                >
                  Enregistrer les changements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
