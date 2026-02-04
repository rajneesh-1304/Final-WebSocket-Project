import { privateApi } from "@/components/privateApi";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (loginData: any) => {
  try {
    const url = `${BASE_URL}/auth/login`
    const res = await axios.post(url, loginData,
    { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error in Reigstering User:", error);
    throw error;
  }
}

export const registerUser = async (registerData: any) => {
  try {
    const url = `${BASE_URL}/user/register`;
    const res = await axios.post(url, registerData);
    return res.data;
  } catch (error) {
    console.error("Error in Reigstering User:", error);
    throw error;
  }
}

export const fetchUsers = async () => {
  const res = await privateApi.get(`${BASE_URL}/auth/getall`,
    { withCredentials: true });
  return res.data;
};

// export const deleteUserr = async (id: any) => {
//   await privateApi.patch(`/user/delete/${id}`);
// };