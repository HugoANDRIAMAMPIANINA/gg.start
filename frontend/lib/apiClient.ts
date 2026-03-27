"server-only";

import axios from "axios";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { setSessionTokens } from "./actions/session";

const apiClient = axios.create({
  baseURL: "http://localhost:4321",
  withCredentials: true,
});

export default apiClient;
