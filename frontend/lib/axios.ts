import { CreateUserDto } from "@/common/dtos/create-user.dto";
import { LoginDto } from "@/common/dtos/login.dto";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:4321/",
  // withCredentials: true,
});

// export const usersClient = {
//   getAll: () => api.get("/users/"),
//   create: (data: CreateUserDto) => api.post("/users/", data),
//   login: (data: LoginDto) => api.post("/auth/login/", data),
// };
