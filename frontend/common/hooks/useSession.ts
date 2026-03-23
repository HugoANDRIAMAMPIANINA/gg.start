import { getSession } from "@/lib/actions/session";
import { useEffect, useState } from "react";

export default function useSession() {
  const [session, setSession] = useState<string>();

  useEffect(() => {
    async function retreiveSession() {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
    }

    retreiveSession();
  }, []);

  return session;
}
