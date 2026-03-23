"use client";

import { getSession } from "@/lib/actions/session";
import { useEffect, useState } from "react";

export default function AccessToken() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function retrieveAccessToken() {
      const accessToken = await getSession();
      if (accessToken) {
        setAccessToken(accessToken);
      }
    }

    retrieveAccessToken();
  }, []);

  return <span>{accessToken}</span>;
}
