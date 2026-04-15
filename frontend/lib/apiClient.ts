"server-only";

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4321",
  withCredentials: true,
});

export default apiClient;
