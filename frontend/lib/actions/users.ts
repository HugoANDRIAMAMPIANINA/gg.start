"use server";

import { User } from "@/common/interfaces/user.interface";
import apiClient from "../apiClient";

export async function fetchUsersByName(name: string): Promise<User[]> {
  const response = await apiClient.get(`/users/?name=${name}&limit=10`);
  const users = response.data;
  return users;
}
